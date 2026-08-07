import GObject from "gi://GObject"
import Gtk from "gi://Gtk"
// import { ThemeEntry } from "./ThemeEntry.js"

export const ThemeEntryRow = GObject.registerClass(
	{
		GTypeName: "ThemeEntryRow",
		CssName: "theme_entry",
		Signals: {
			"delete-entry": { param_types: [GObject.TYPE_STRING] },
		},
		Template: "resource:///io/github/VardanHeroic/solarbg_gtk/ui/ThemeEntry.ui",
		InternalChildren: ["image", "name", "start", "end"],
		Properties: {
			ID: GObject.ParamSpec.string("id", "ID", "UUID of entry", GObject.ParamFlags.READWRITE, ""),
		},
	},
	class ThemeEntryRow extends Gtk.Box {
		// set id(newID) {
		// 	console.log("halal")
		//
		// 	this.id = newID
		// }

		// get id() {
		// 	return this.id
		// }

		onEntryRemoval(_button) {
			this.emit("delete-entry", this.id)
		}
	},
)
