import GObject from "gi://GObject"
import Gtk from "gi://Gtk"
import Gio from "gi://Gio"
import { ThemeEntry } from "./ThemeEntry.js"
import { ThemeEntryRow } from "./ThemeEntryRow.js"
import { isTimeStamp } from "./utils.js"
// import GLib from "gi://GLib"

export const EditPage = GObject.registerClass(
	{
		GTypeName: "EditPage",
		CssName: "edit_page",
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
		InternalChildren: ["factorybox"],
	},
	class extends Gtk.Widget {
		constructor(params = {}) {
			super(params)

			this.factory = new Gtk.SignalListItemFactory()
			this.factory.connect("setup", (_, listItem) => {
				let widget = new ThemeEntryRow()
				listItem.child = widget
			})

			this.factory.connect("bind", (_, listItem) => {
				const row = listItem.child
				const item = listItem.item
				row.bindings = [
					item.bind_property("path", row._image, "file", GObject.BindingFlags.SYNC_CREATE),
					item.bind_property("start", row._start, "text", GObject.BindingFlags.SYNC_CREATE),
					item.bind_property("end", row._end, "text", GObject.BindingFlags.SYNC_CREATE),
					item.bind_property("file-name", row._name, "label", GObject.BindingFlags.SYNC_CREATE),
				]
			})

			this.factory.connect("unbind", (_, listItem) => {
				const row = listItem.child
				for (const binding of row.bindings ?? []) {
					binding.unbind()
				}
				row.bindings = []
			})
		}

		// deleteEntry(_widget, id) {
		// 	console.log(id)
		// }
		// _init() {
		// super._init()
		// }
		// onFactorySetup(_, listItem) {
		// 	console.log(listItem.get_child())
		// }

		async createEntryList(path) {
			this.themeentries = new Gio.ListStore({ item_type: ThemeEntry })
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
				themeArray.forEach(({ path, start, end }, i) => {
					this.themeentries.append(
						new ThemeEntry({ path: themePath + "/" + path, "file-name": path, start: start, end: end, id: i }),
					)
				})

				const selectionModel = new Gtk.MultiSelection({ model: this.themeentries })
				const listView = new Gtk.ListView({ model: selectionModel, factory: this.factory, enable_rubberband: true })
				this._factorybox.prepend(listView)
			} catch (error) {
				console.warn(`(tried to read ${path}) ${error}`)
				throw error
			}
		}
	},
)
