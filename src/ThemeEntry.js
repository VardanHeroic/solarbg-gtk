import GObject from "gi://GObject"
// import Gtk from "gi://Gtk"

export const ThemeEntry = GObject.registerClass(
	{
		// GTypeName: "ThemeEntry",
		// CssName: "theme_entry",
		// Signals: {
		// 	"delete-entry": { param_types: [GObject.TYPE_INT] },
		// },
		Properties: {
			FileName: GObject.ParamSpec.string("file-name", "Path", "The name of the image file", GObject.ParamFlags.READWRITE, ""),
			Path: GObject.ParamSpec.string("path", "File Name", "The path of the image file", GObject.ParamFlags.READWRITE, ""),
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
			ID: GObject.ParamSpec.string("id", "ID", "ID number", GObject.ParamFlags.READWRITE, ""),
		},
	},
	class extends GObject.Object { },
)
