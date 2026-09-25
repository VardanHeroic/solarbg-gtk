import GObject from "gi://GObject"
import Gtk from "gi://Gtk"
import GLib from "gi://GLib"

export const Theme = GObject.registerClass(
	{
		// Template: "resource:///io/github/VardanHeroic/solarbg_gtk/ui/Theme.ui",
		Properties: {
			ThemePath: GObject.param_spec_variant(
				"theme-path",
				"Theme Path",
				"The path of the theme",
				new GLib.VariantType("s"),
				new GLib.Variant("s", ""),
				GObject.ParamFlags.READWRITE,
			),
			ThemeName: GObject.ParamSpec.string("theme-name", "Theme Name", "The name of the theme", GObject.ParamFlags.READWRITE, ""),
			ThemeSolar: GObject.ParamSpec.boolean("theme-solar", "Theme Solar", "Is theme solar", GObject.ParamFlags.READWRITE, null),
			ThemeThumbnail: GObject.ParamSpec.string(
				"theme-thumbnail",
				"Theme Thumbnail",
				"The path to thumbnail image of the theme",
				GObject.ParamFlags.READWRITE,
				"",
			),
			ID: GObject.ParamSpec.string("id", "ID", "UUID of theme", GObject.ParamFlags.READWRITE, ""),
		},
	},
	class extends Gtk.Widget { },
)
