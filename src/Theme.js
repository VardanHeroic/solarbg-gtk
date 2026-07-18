import GObject from "gi://GObject"
import Gtk from "gi://Gtk"
// import GLib from "gi://GLib"

export const Theme = GObject.registerClass(
	{
		GTypeName: "Theme",
		CssName: "theme",
		// Template: "resource:///io/github/VardanHeroic/solarbg_gtk/ui/Theme.ui",
		Properties: {
			ThemeJSON: GObject.ParamSpec.string("theme-json", "Theme JSON", "The JSON of the theme", GObject.ParamFlags.READWRITE, ""),
		},
	},
	class extends Gtk.Widget { },
)
