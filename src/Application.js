import Gtk from "gi://Gtk"
import GObject from "gi://GObject"
import { Window } from "./Window.js"
import "./WelcomeWidget.js"

export const SolarbgApplication = GObject.registerClass(
	{
		GTypeName: "SolarbgApplication",
	},
	class extends Gtk.Application {
		vfunc_activate() {
			const window = new Window({ application: this })
			window.present()
		}
	},
)
