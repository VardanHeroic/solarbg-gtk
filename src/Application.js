import Gtk from "gi://Gtk"
import Gdk from "gi://Gdk"
import GObject from "gi://GObject"
import { Window } from "./Window.js"
import "./ThemeEntry.js"
import "./HomePage.js"

export const SolarbgApplication = GObject.registerClass(
	{
		GTypeName: "SolarbgApplication",
	},
	class extends Gtk.Application {
		vfunc_activate() {
			const window = new Window({ application: this })
			window.present()
		}

		vfunc_startup() {
			super.vfunc_startup()
			this.#loadStylesheet()
		}

		#loadStylesheet() {
			// Load the stylesheet in a CssProvider
			const provider = new Gtk.CssProvider()
			provider.load_from_resource("/io/github/VardanHeroic/solarbg_gtk/css/style.css")

			// Add the provider to the StyleContext of the default display
			Gtk.StyleContext.add_provider_for_display(Gdk.Display.get_default(), provider, Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION)
		}
	},
)
