import GObject from "gi://GObject"
import Gtk from "gi://Gtk"
import Gio from "gi://Gio"
import { ThemeEntry } from "./ThemeEntry.js"
import { isTimeStamp } from "./utils.js"
// import GLib from "gi://GLib"

export const EditPage = GObject.registerClass(
	{
		GTypeName: "EditPage",
		CssName: "edit_page",
		// Signals: {
		// 	"edit-cancel": {},
		// },
		Template: "resource:///io/github/VardanHeroic/solarbg_gtk/ui/EditPage.ui",
		Properties: {
			// ThemePath: GObject.ParamSpec.string("themepath", "ThemePath", "The path of editing theme", GObject.ParamFlags.READWRITE, ""),
			ThemeEntries: GObject.ParamSpec.object(
				"themeentries",
				"ThemeEntriess",
				"List of theme entries",
				GObject.ParamFlags.READWRITE,
				Gio.ListStore,
			),
		},
	},
	class extends Gtk.Widget {
		constructor(params = {}) {
			super(params)
		}

		async createEntryList(path) {
			this.themeentries = Gio.ListStore.new(ThemeEntry)
			const themeJSONfile = Gio.File.new_for_path(path)
			const decoder = new TextDecoder("utf-8")
			let themePath = path.split("/")
			themePath.pop()
			themePath = themePath.join("/")

			try {
				const [contents, __] = await themeJSONfile.load_contents_async(null) // console.log(contents)
				const themeArray = JSON.parse(decoder.decode(contents))
				if (!themeArray.every(isTimeStamp)) {
					throw new Error("file is not a solar theme")
				}
				console.log(themePath)
				themeArray.forEach(entry => {
					// console.log(path, start, end)

					this.themeentries.append(new ThemeEntry({ "file-name": themePath + "/" + entry.path, ...entry }))
				})
			} catch (error) {
				console.warn(`(tried to read ${path}) ${error}`)
				throw error
			}
		}
	},
)
