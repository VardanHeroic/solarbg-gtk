import GObject from "gi://GObject"
import Gtk from "gi://Gtk"
import Gio from "gi://Gio"
import { ThemeEntry } from "./ThemeEntry.js"
import GLib from "gi://GLib"

export const EditPage = GObject.registerClass(
	{
		GTypeName: "EditPage",
		CssName: "edit_page",
		// Signals: {
		// 	"edit-cancel": {},
		// },
		Template: "resource:///io/github/VardanHeroic/solarbg_gtk/ui/EditPage.ui",
		Properties: {
			// ThemePath: GObject.ParamSpec.string("themepath", "ThemePath", "The path of editing theme", GObject.ParamFlags.READWRITE, ""),
			ThemeEntries: GObject.ParamSpec.object(
				"themeentries",
				"ThemeEntriess",
				"List of theme entries",
				GObject.ParamFlags.READWRITE,
				Gio.ListStore,
			),
		},
	},
	class extends Gtk.Widget {
		constructor(params = {}) {
			super(params)
		}

		async createEntryList(path) {
			this.themeentries = Gio.ListStore.new(ThemeEntry)
			this.themeentries.append(
				new ThemeEntry({
					"file-name": path,
					start: 14,
					end: 88,
				}),
			)
		}
	},
)
