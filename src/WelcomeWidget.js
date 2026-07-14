import GObject from "gi://GObject"
import Gtk from "gi://Gtk"

export const WelcomeWidget = GObject.registerClass(
	{
		GTypeName: "SolarbgWelcomeWidget",
		Template: "resource:///io/github/VardanHeroic/solarbg_gtk/ui/WelcomeWidget.ui",
	},
	class extends Gtk.Widget {},
)
