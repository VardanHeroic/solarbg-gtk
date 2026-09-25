import GObject from "gi://GObject"
import Gtk from "gi://Gtk"
import Gio from "gi://Gio"
import { Theme } from "./Theme.js"
import { ThemeRow } from "./ThemeRow.js"
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
		InternalChildren: ["factorybox"],
		Properties: {
			Themes: GObject.ParamSpec.object("themes", "Themes", "List of theme JSONs", GObject.ParamFlags.READWRITE, Gio.ListStore),
		},
	},
	class extends Gtk.Widget {
		constructor(params = {}) {
			super(params)
			this.initialize().catch(logError)

			this.factory = new Gtk.SignalListItemFactory()
			this.factory.connect("setup", (_, listItem) => {
				let widget = new ThemeRow()
				listItem.child = widget
			})

			this.factory.connect("bind", (_, listItem) => {
				const row = listItem.child
				const item = listItem.item
				row.id = item.id
				// console.log(item["theme-name"])
				row.bindings = [
					item.bind_property("theme-thumbnail", row._thumbnail, "file", GObject.BindingFlags.SYNC_CREATE), // try GObject.BindingFlags.BIDIRECTIONAL
					item.bind_property("theme-name", row._name, "label", GObject.BindingFlags.SYNC_CREATE),
					item.bind_property("theme-path", row._editbutton, "action-target", GObject.BindingFlags.SYNC_CREATE),
					item.bind_property("theme-path", row._deletebutton, "action-target", GObject.BindingFlags.SYNC_CREATE),
					item.bind_property("theme-path", row._renamebutton, "action-target", GObject.BindingFlags.SYNC_CREATE),
				]
				// 	row.signals = [
				// 		row.connect("delete-entry", (_, targetid) => {
				// 			for (let i = 0; i < this.themeentries.get_n_items(); i++) {
				// 				const item = this.themeentries.get_item(i)
				// 				if (item.id === targetid) {
				// 					this.themeentries.remove(i)
				// 					break
				// 				}
				// 			}
				// 		}),
				// 	]
				// })
				//
				// this.factory.connect("unbind", (_, listItem) => {
				// 	const row = listItem.child
				// 	for (const binding of row.bindings ?? []) {
				// 		binding.unbind()
				// 	}
				// 	row.bindings = []
				// 	for (const signal of row.signals ?? []) {
				// 		row.disconnect(signal)
				// 	}
				// 	row.signals = []
			})
		}

		async initialize() {
			await this.findThemes()
		}
		//
		// addTheme() {
		// 	const path = GLib.build_filenamev([GLib.get_home_dir(), "/.local/share/solarbg/themes/newTheme"])
		// 	this.themes.append(
		// 		new Theme({
		// 			"theme-path": new GLib.Variant("s", path),
		// 			"theme-name": "newTheme",
		// 			"theme-solar": true,
		// 			"theme-thumbnail": null,
		// 		}),
		// 	)
		// }

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
							id: GLib.uuid_string_random(),
						}),
					)
					const selectionModel = new Gtk.MultiSelection({ model: this.themes })
					const gridView = new Gtk.GridView({
						model: selectionModel,
						factory: this.factory,
						enable_rubberband: true,
						hexpand: true,
						vexpand: true,
					})
					this._factorybox.prepend(gridView)

					// break
					// case "application/xml":
					// default:
					// continue
				}
			}
		}
	},
)
