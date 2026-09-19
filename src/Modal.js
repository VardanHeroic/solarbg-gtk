import GObject from "gi://GObject"
import Gtk from "gi://Gtk"
// import Gio from "gi://Gio"
// import GLib from "gi://GLib"

export const Modal = GObject.registerClass(
	{
		GTypeName: "Modal",
		Template: "resource:///io/github/VardanHeroic/solarbg_gtk/ui/Modal.ui",
		// InternalChildren: ["stack", "edit_page", "home_page"],
	},
	class extends Gtk.ApplicationWindow {
		constructor(params = {}) {
			super(params)
			this.modal = true
			this.default_width = 400
			this.default_height = 200
		}
	},
)
