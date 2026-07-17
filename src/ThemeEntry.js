import GObject from "gi://GObject"
import Gtk from "gi://Gtk"

export const ThemeEntry = GObject.registerClass(
	{
		GTypeName: "ThemeEntry",
		CssName: "theme_entry",
		// Signals: {
		// 	"edit-cancel": {},
		// },
		Template: "resource:///io/github/VardanHeroic/solarbg_gtk/ui/ThemeEntry.ui",
		Properties: {
			FileName: GObject.ParamSpec.string("file-name", "File Name", "The name of the image file", GObject.ParamFlags.READWRITE, ""),
			StartAltitude: GObject.ParamSpec.double(
				"start",
				"start-altitude",
				"The sun altitude at which image begins to be wallpaper",
				GObject.ParamFlags.READWRITE,
				Number.MIN_SAFE_INTEGER,
				Number.MAX_SAFE_INTEGER,
				0.0,
			),
			EndAltitude: GObject.ParamSpec.double(
				"end",
				"end-altitude",
				"The sun altitude at which image stops to be wallpaper",
				GObject.ParamFlags.READWRITE,
				Number.MIN_SAFE_INTEGER,
				Number.MAX_SAFE_INTEGER,
				0.0,
			),
		},
	},
	class extends Gtk.Widget {
		// onEditCancel(_button) {
		// 	this.emit("edit-cancel")
		// }
	},
)
