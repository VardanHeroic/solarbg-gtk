import GObject from "gi://GObject"
import Gtk from "gi://Gtk"
// import Gio from "gi://Gio"
// import GLib from "gi://GLib"

export const DeleteModal = GObject.registerClass(
	{
		GTypeName: "DeleteModal",
		Template: "resource:///io/github/VardanHeroic/solarbg_gtk/ui/DeleteModal.ui",
		// InternalChildren: ["buffer"],
		Signals: {
			"confirm-delete": {},
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

		onDeleteConfirm() {
			this.emit("confirm-delete")
		}

		onCancel() {
			this.close()
		}
	},
)
