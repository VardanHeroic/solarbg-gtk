import GObject from "gi://GObject"
import Gtk from "gi://Gtk"

export const Window = GObject.registerClass(
	{
		GTypeName: "SolarbgWindow",
		Template: "resource:///io/github/VardanHeroic/solarbg_gtk/ui/Window.ui",
		InternalChildren: ["stack"],
	},
	class extends Gtk.ApplicationWindow {
		vfunc_close_request() {
			super.vfunc_close_request()
			this.run_dispose()
		}
		gotoHome(_widget) {
			this._stack.visibleChildName = "home"
		}
	},
)
