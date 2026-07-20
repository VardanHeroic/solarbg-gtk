import GObject from "gi://GObject"
import Gtk from "gi://Gtk"
import Gio from "gi://Gio"
import { Theme } from "./Theme.js"
import GLib from "gi://GLib"

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
			// try {
			this.#findThemes()
			// } catch (error) {
			// console.error(error)
			// }

			// onEditCancel(_button) {
			// 	this.emit("edit-cancel")
			// }
			// const label = new Gtk.Label({ label: "sdalkj;f" })
			// this.append(label)
			// for (let index = 0; index < 5; index++) {
			// const button = new Gtk.Button({
			// 	label: index.toString(),
			// })
			// button.connect("clicked", () => {
			// 	button.activate_action("win.change-view", new GLib.Variant("s", "edit"))
			// })
			// button.set_action_name = "win.change-view"
			// button.set_action_target = "edit"
			// this.append(button)
			// }
		}

		#findThemes() {
			// Create the Gio.ListStore that will contain File objects
			this.themes = Gio.ListStore.new(Theme)

			const filepath = GLib.build_filenamev([GLib.get_home_dir(), "/.local/share/solarbg/themes"])
			const currentDir = Gio.File.new_for_path(filepath)

			// Get an enumerator of all children
			const children = currentDir.enumerate_children("standard::*", Gio.FileQueryInfoFlags.NOFOLLOW_SYMLINKS, null)

			// Iterate over the enumerator and add each child to the list store
			let fileInfo
			let contentsString
			while ((fileInfo = children.next_file(null))) {
				// console.log(fileInfo.get_content_type())
				if (fileInfo.get_content_type() === "inode/directory") {
					const path = GLib.build_filenamev([
						GLib.get_home_dir(),
						"/.local/share/solarbg/themes/",
						fileInfo.get_display_name(),
						"/theme.json",
					])
					const themeJSONfile = Gio.File.new_for_path(path)
					const [_, contents, __] = themeJSONfile.load_contents(null)
					const decoder = new TextDecoder("utf-8")
					// console.log(contents)
					contentsString = decoder.decode(contents)
				}
				this.themes.append(
					new Theme({
						"theme-json": contentsString ?? fileInfo.get_display_name(),
					}),
				)
			}
		}
	},
)
