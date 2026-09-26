import GObject from "gi://GObject"
import Gtk from "gi://Gtk"
import Gio from "gi://Gio"
import GLib from "gi://GLib"
import { InputModal } from "./InputModal.js"
import { DeleteModal } from "./DeleteModal.js"
import { Theme } from "./Theme.js"

export const Window = GObject.registerClass(
	{
		GTypeName: "SolarbgWindow",
		Template: "resource:///io/github/VardanHeroic/solarbg_gtk/ui/Window.ui",
		InternalChildren: ["stack", "edit_page", "home_page"],
	},
	class extends Gtk.ApplicationWindow {
		constructor(params = {}) {
			super(params)
			this.#setupActions()
			this.default_width = 800
			this.default_height = 600
		}

		vfunc_close_request() {
			super.vfunc_close_request()
			this.run_dispose()
		}
		#setupActions() {
			const changeViewAction = new Gio.SimpleAction({ name: "change-view", parameterType: GLib.VariantType.new("s") })
			const beginEditAction = new Gio.SimpleAction({ name: "begin-edit", parameterType: GLib.VariantType.new("s") })
			const cancelEditAction = new Gio.SimpleAction({ name: "cancel-edit" })
			const saveAction = new Gio.SimpleAction({ name: "save" })
			const addThemeAction = new Gio.SimpleAction({ name: "add-theme", parameterType: GLib.VariantType.new("s") })
			const setNameAction = new Gio.SimpleAction({ name: "set-name", parameterType: GLib.VariantType.new("s") })
			const deleteThemeAction = new Gio.SimpleAction({ name: "delete-theme", parameterType: GLib.VariantType.new("s") })
			// let newName

			changeViewAction.connect("activate", (_action, params) => (this._stack.visibleChildName = params.unpack()))

			beginEditAction.connect("activate", async (_action, params) => {
				try {
					this._edit_page.themepath = params.unpack()
					await this._edit_page.createEntryList()
					changeViewAction.activate(new GLib.Variant("s", "edit"))
				} catch (error) {
					console.warn(error)
				}
			})

			cancelEditAction.connect("activate", (_action, _) => {
				const box = this._edit_page._factorybox
				box.remove(box.get_first_child())
				changeViewAction.activate(new GLib.Variant("s", "home"))
			})

			deleteThemeAction.connect("activate", (_action, params) => {
				const modal = new DeleteModal()
				modal.set_transient_for(this)
				modal.present()
				modal.connect("confirm-delete", async (_, __) => {
					modal.close()
					let themeFolderPath = params.unpack().split("/")
					let fileInfo
					themeFolderPath.pop()
					themeFolderPath = themeFolderPath.join("/")

					const themeFolder = Gio.File.new_for_path(themeFolderPath)
					const children = themeFolder.enumerate_children("standard::*", Gio.FileQueryInfoFlags.NOFOLLOW_SYMLINKS, null)
					while ((fileInfo = children.next_file(null))) {
						try {
							const file = themeFolder.get_child(fileInfo.get_name())
							await file.delete_async(GLib.PRIORITY_DEFAULT, null)
						} catch (error) {
							console.error(error)
						}
					}
					try {
						await themeFolder.delete_async(GLib.PRIORITY_DEFAULT, null)
						for (let i = 0; i < this._home_page.themes.get_n_items(); i++) {
							const item = this._home_page.themes.get_item(i)
							console.log(item["theme-path"].get_string()[0], params.unpack())
							if (item["theme-path"].get_string()[0] === params.unpack()) {
								this._home_page.themes.remove(i)
								console.log(7989)
								break
							}
						}
						// for (let i = 0; i < this._home_page.themes.get_n_items(); i++) {
						// 	console.log(this._home_page.themes.get_item(i)["theme-path"])
						// }
					} catch (error) {
						console.error(error)
					}
				})
				// move to factory
			})

			setNameAction.connect("activate", (_action, params) => {
				const modal = new InputModal()
				modal.set_transient_for(this)
				modal.present()
				modal.connect("confirm-name", async (_, newName) => {
					modal.close()
					if (params.unpack()) {
						const themeFolder = Gio.File.new_for_path(
							GLib.build_filenamev([GLib.get_home_dir(), "/.local/share/solarbg/themes", params.unpack().split("/").at(-2)]),
						)
						const newThemeFolder = Gio.File.new_for_path(
							GLib.build_filenamev([GLib.get_home_dir(), "/.local/share/solarbg/themes", newName]),
						)
						try {
							await themeFolder.move_async(newThemeFolder, Gio.FileCopyFlags.NONE, GLib.PRIORITY_DEFAULT, null, null)
							// this._home_page.themes.append(new Theme({
							// 	"theme-path":""
							// }))
							// await this._home_page.findThemes()

							// for (let i = 0; i < this._home_page.themes.get_n_items(); i++) {
							// 	const item = this._home_page.themes.get_item(i)
							// 	if (item["theme-path"] === params.unpack()) {
							// item["theme-path"] = newName
							// 	this._home_page.themes.remove(i)
							// 	this._home_page.themes.insert(
							// 		i,
							// 		new Theme({
							// 			"theme-path": GLib.build_filenamev([
							// 				GLib.get_home_dir(),
							// 				"/.local/share/solarbg/themes",
							// 				newName,
							// 				"theme.json",
							// 			]),
							// 			"theme-name": params.unpack().split("/").at(-2),
							// 			"theme-solar": item["theme-solar"],
							// 			"theme-thumbnail": item["theme-thumbnail"],
							// 			id: item.id,
							// 		}),
							// 	)
							//
							// 	break
							// }
							// }
						} catch (error) {
							console.error(error)
						}
						return
					}
					addThemeAction.activate(GLib.Variant.new_string(newName))
				})
			})

			addThemeAction.connect("activate", async (_, params) => {
				try {
					this._edit_page.themepath = GLib.build_filenamev([
						GLib.get_home_dir(),
						"/.local/share/solarbg/themes",
						params.unpack(),
						"theme.json",
					])
					await this._edit_page.createEntryList()
					changeViewAction.activate(new GLib.Variant("s", "edit"))
				} catch (error) {
					console.warn(error)
				}
			})

			saveAction.connect("activate", async (_, __) => {
				let themePath = this._edit_page.themepath.split("/")
				themePath.pop()
				themePath = themePath.join("/")
				const themeFolder = Gio.File.new_for_path(themePath)

				try {
					await themeFolder.make_directory_async(GLib.PRIORITY_DEFAULT, null)
				} catch (e) {
					console.warn(e)
				}

				try {
					const themeFile = Gio.File.new_for_path(this._edit_page.themepath)
					const newTheme = []

					for (let i = 0; i < this._edit_page.themeentries.get_n_items(); i++) {
						const entry = this._edit_page.themeentries.get_item(i)
						newTheme.push({ path: entry["file-name"], start: entry.start, end: entry.end })
						await Gio.File.new_for_path(entry.path).copy_async(
							Gio.File.new_for_path(themePath + "/" + entry["file-name"]),
							Gio.FileCopyFlags.OVERWRITE,
							GLib.PRIORITY_DEFAULT,
							null,
							(nWritten, nTotal) => {
								const percent = Math.floor(100 * (nWritten / nTotal))
								console.debug(`Progress: ${percent}%`)
							},
						)
					}

					const bytes = new GLib.Bytes(JSON.stringify(newTheme))
					const [_etag] = await themeFile.replace_contents_bytes_async(
						bytes,
						null,
						false,
						Gio.FileCreateFlags.REPLACE_DESTINATION,
						null,
					)

					cancelEditAction.activate(null)
					await this._home_page.findThemes()
				} catch (error) {
					console.error(error)
				}
			})

			this.add_action(changeViewAction)
			this.add_action(beginEditAction)
			this.add_action(cancelEditAction)
			this.add_action(saveAction)
			this.add_action(addThemeAction)
			this.add_action(setNameAction)
			this.add_action(deleteThemeAction)
		}
	},
)
