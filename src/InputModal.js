import GObject from "gi://GObject"
import Gtk from "gi://Gtk"
// import Gio from "gi://Gio"
// import GLib from "gi://GLib"

export const InputModal = GObject.registerClass(
	{
		GTypeName: "InputModal",
		Template: "resource:///io/github/VardanHeroic/solarbg_gtk/ui/InputModal.ui",
		InternalChildren: ["buffer"],
		Signals: {
			"confirm-name": { param_types: [GObject.TYPE_STRING] },
			// cancel: {},
		},
		// Properties: {
		// 	NewName: GObject.ParamSpec.string("newname", "NewName", "Entered new name", GObject.ParamFlags.READWRITE, ""),
		// },
	},
	class extends Gtk.Dialog {
		constructor(params = {}) {
			super(params)
			this.modal = true
			this.default_width = 400
			this.default_height = 200
		}

		onNameConfirm() {
			this.emit("confirm-name", this._buffer.text)
		}

		onCancel() {
			// this.emit("cancel")
			this.close()
		}
	},
)
