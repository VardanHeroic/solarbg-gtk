import GObject from "gi://GObject"
import Gtk from "gi://Gtk"
// import Gio from "gi://Gio"
// import GLib from "gi://GLib"

export const Modal = GObject.registerClass(
	{
		GTypeName: "Modal",
		Template: "resource:///io/github/VardanHeroic/solarbg_gtk/ui/Modal.ui",
		InternalChildren: ["buffer"],
		Signals: {
			"confirm-name": { param_types: [GObject.TYPE_STRING] },
		},
		// Properties: {
		// 	NewName: GObject.ParamSpec.string("newname", "NewName", "Entered new name", GObject.ParamFlags.READWRITE, ""),
		// },
	},
	class extends Gtk.ApplicationWindow {
		constructor(params = {}) {
			super(params)
			this.modal = true
			this.default_width = 400
			this.default_height = 200
		}

		onNameConfirm() {
			// this.newname = this._buffer.text
			// console.log(this.newname)
			this.emit("confirm-name", this._buffer.text)
		}
	},
)
