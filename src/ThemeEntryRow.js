import GObject from "gi://GObject"
import Gtk from "gi://Gtk"
// import { ThemeEntry } from "./ThemeEntry.js"

export const ThemeEntryRow = GObject.registerClass(
	{
		GTypeName: "ThemeEntryRow",
		CssName: "theme_entry",
		Signals: {
			"delete-entry": { param_types: [GObject.TYPE_INT] },
		},
		Template: "resource:///io/github/VardanHeroic/solarbg_gtk/ui/ThemeEntry.ui",
		InternalChildren: ["image", "name", "start", "end"],
	},
	class ThemeEntryRow extends Gtk.Box { },
)
