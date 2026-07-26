import GObject from "gi://GObject"
import Gtk from "gi://Gtk"
import Gio from "gi://Gio"
import GLib from "gi://GLib"

export const Window = GObject.registerClass(
	{
		GTypeName: "SolarbgWindow",
		Template: "resource:///io/github/VardanHeroic/solarbg_gtk/ui/Window.ui",
		InternalChildren: ["stack"],
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
		// gotoHome(_widget) {
		// 	this._stack.visibleChildName = "home"
		// }
		#setupActions() {
			// Create the action
			const changeViewAction = new Gio.SimpleAction({
				name: "change-view",
				parameterType: GLib.VariantType.new("s"),
			})
			const beginEditAction = new Gio.SimpleAction({
				name: "begin-edit",
				parameterType: GLib.VariantType.new("s"),
			})
			// Connect to the activate signal to run the callback
			changeViewAction.connect("activate", (_action, params) => {
				// console.log(params)
				this._stack.visibleChildName = params.unpack()
			})

			beginEditAction.connect("activate", (_action, params) => {
				console.log(params.unpack())
				changeViewAction.activate(new GLib.Variant("s", "edit"))
			})

			// Add the action to the window
			this.add_action(changeViewAction)
			this.add_action(beginEditAction)
		}
	},
)
