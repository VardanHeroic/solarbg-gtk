import GObject from "gi://GObject"
import Gtk from "gi://Gtk"
import Gio from "gi://Gio"
import { Theme } from "./Theme.js"
import GLib from "gi://GLib"
import { isTimeStamp } from "./utils.js"

export const HomePage = GObject.registerClass(
	{
		GTypeName: "HomePage",
		CssName: "home_page",
		// Signals: {
		// 	"edit-cancel": {},
		// },
		Template: "resource:///io/github/VardanHeroic/solarbg_gtk/ui/HomePage.ui",
		Properties: {
			Themes: GObject.ParamSpec.object("themes", "Themes", "List of theme JSONs", GObject.ParamFlags.READWRITE, Gio.ListStore),
		},
	},
	class extends Gtk.Widget {
		constructor(params = {}) {
			super(params)
			this.initialize().catch(logError)
		}

		async initialize() {
			await this.findThemes()
		}

		async findThemes() {
			// Create the Gio.ListStore that will contain File objects
			this.themes = Gio.ListStore.new(Theme)

			const themesPath = GLib.build_filenamev([GLib.get_home_dir(), "/.local/share/solarbg/themes"])
			const themesDir = Gio.File.new_for_path(themesPath)

			const decoder = new TextDecoder("utf-8")
			// Get an enumerator of all children
			const children = themesDir.enumerate_children("standard::*", Gio.FileQueryInfoFlags.NOFOLLOW_SYMLINKS, null)

			// Iterate over the enumerator and add each child to the list store
			let fileInfo
			let contentsString
			let thumbnail
			// turn above vars into object later please
			while ((fileInfo = children.next_file(null))) {
				// switch (fileInfo.get_content_type()) {
				// case "inode/directory":
				if (fileInfo.get_content_type() === "inode/directory") {
					const path = GLib.build_filenamev([themesPath, fileInfo.get_display_name(), "/theme.json"])
					const themeJSONfile = Gio.File.new_for_path(path)

					try {
						const [contents, __] = await themeJSONfile.load_contents_async(null) // console.log(contents)
						contentsString = decoder.decode(contents)
						const themeArray = JSON.parse(contentsString)
						if (!themeArray.every(isTimeStamp)) {
							throw new Error("file is not a solar theme")
						}
						thumbnail = themeArray[0].path
					} catch (error) {
						console.warn(`(tried to read ${path}) ${error}`)
						continue
					}
					this.themes.append(
						new Theme({
							"theme-path": new GLib.Variant("s", path),
							"theme-name": fileInfo.get_display_name(),
							"theme-solar": fileInfo.get_content_type() === "inode/directory",
							"theme-thumbnail": GLib.build_filenamev([themesPath, fileInfo.get_display_name(), thumbnail]),
						}),
					)

					// break
					// case "application/xml":
					// default:
					// continue
				}
			}
		}
	},
)
