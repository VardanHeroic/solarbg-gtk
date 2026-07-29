import GObject from "gi://GObject"
import Gtk from "gi://Gtk"
import Gio from "gi://Gio"
import GLib from "gi://GLib"

export const Window = GObject.registerClass(
	{
		GTypeName: "SolarbgWindow",
		Template: "resource:///io/github/VardanHeroic/solarbg_gtk/ui/Window.ui",
		InternalChildren: ["stack", "edit_page"],
	},
	class extends Gtk.ApplicationWindow {
		constructor(params = {}) {
			super(params)
			this.#setupActions()
		}

		vfunc_close_request() {
			super.vfunc_close_request()
			this.run_dispose()
		}
		#setupActions() {
			const changeViewAction = new Gio.SimpleAction({
				name: "change-view",
				parameterType: GLib.VariantType.new("s"),
			})
			const beginEditAction = new Gio.SimpleAction({
				name: "begin-edit",
				parameterType: GLib.VariantType.new("s"),
			})

			changeViewAction.connect("activate", (_action, params) => {
				this._stack.visibleChildName = params.unpack()
			})

			beginEditAction.connect("activate", (_action, params) => {
				/*add trycatch later*/ this._edit_page.createEntryList(params.unpack())
				changeViewAction.activate(new GLib.Variant("s", "edit"))
			})

			this.add_action(changeViewAction)
			this.add_action(beginEditAction)
		}
	},
)
