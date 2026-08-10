import GObject from "gi://GObject"
import Gtk from "gi://Gtk"
import Gio from "gi://Gio"
import { ThemeEntry } from "./ThemeEntry.js"
import { ThemeEntryRow } from "./ThemeEntryRow.js"
import { isTimeStamp } from "./utils.js"
import GLib from "gi://GLib"

export const EditPage = GObject.registerClass(
	{
		GTypeName: "EditPage",
		CssName: "edit_page",
		Template: "resource:///io/github/VardanHeroic/solarbg_gtk/ui/EditPage.ui",
		Properties: {
			ThemePath: GObject.ParamSpec.string("themepath", "ThemePath", "The path of editing theme", GObject.ParamFlags.READWRITE, ""),
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
				row.id = item.id
				row.bindings = [
					item.bind_property("path", row._image, "file", GObject.BindingFlags.SYNC_CREATE), // try GObject.BindingFlags.BIDIRECTIONAL
					item.bind_property("start", row._start, "value", GObject.BindingFlags.SYNC_CREATE | GObject.BindingFlags.BIDIRECTIONAL),
					item.bind_property("end", row._end, "value", GObject.BindingFlags.SYNC_CREATE | GObject.BindingFlags.BIDIRECTIONAL),
					item.bind_property("file-name", row._name, "label", GObject.BindingFlags.SYNC_CREATE),
				]
				row.signals = [
					row.connect("delete-entry", (_, targetid) => {
						for (let i = 0; i < this.themeentries.get_n_items(); i++) {
							const item = this.themeentries.get_item(i)
							if (item.id === targetid) {
								this.themeentries.remove(i)
								break
							}
						}
					}),
				]
			})

			this.factory.connect("unbind", (_, listItem) => {
				const row = listItem.child
				for (const binding of row.bindings ?? []) {
					binding.unbind()
				}
				row.bindings = []
				for (const signal of row.signals ?? []) {
					row.disconnect(signal)
				}
				row.signals = []
			})
		}

		addEntry(_button) {
			const filter = new Gtk.FileFilter()

			filter.set_name = "images"
			filter.add_pixbuf_formats()

			const dialog = new Gtk.FileDialog({
				title: "Select a file",
				default_filter: filter,
			})

			dialog.open(
				_button.get_root(),
				null, // cancellable
				(dialog, result) => {
					try {
						const file = dialog.open_finish(result)
						if (file) {
							this.themeentries.append(
								new ThemeEntry({
									path: file.get_path(),
									"file-name": file.get_path().split("/").pop(),
									start: 0,
									end: 0,
									id: GLib.uuid_string_random(),
								}),
							)
						}
					} catch (e) {
						print(e.message)
					}
				},
			)
		}

		async createEntryList() {
			this.themeentries = new Gio.ListStore({ item_type: ThemeEntry })
			const themeJSONfile = Gio.File.new_for_path(this.themepath)
			const decoder = new TextDecoder("utf-8")
			let themePath = this.themepath.split("/")
			themePath.pop()
			themePath = themePath.join("/")

			try {
				if (themeJSONfile.query_exists(null)) {
					const [contents, __] = await themeJSONfile.load_contents_async(null) // console.log(contents)
					const themeArray = JSON.parse(decoder.decode(contents))
					if (!themeArray.every(isTimeStamp)) {
						throw new Error("file is not a solar theme")
					}
					themeArray.forEach(({ path, start, end }) => {
						this.themeentries.append(
							new ThemeEntry({
								path: themePath + "/" + path,
								"file-name": path,
								start: start,
								end: end,
								id: GLib.uuid_string_random(),
							}),
						)
					})
				}

				const selectionModel = new Gtk.MultiSelection({ model: this.themeentries })
				const listView = new Gtk.ListView({
					model: selectionModel,
					factory: this.factory,
					enable_rubberband: true,
					hexpand: true,
					vexpand: true,
				})
				this._factorybox.prepend(listView)
			} catch (error) {
				console.warn(`(tried to read ${this.themepath}) ${error}`)
				throw error
			}
		}
	},
)
