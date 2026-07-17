import GObject from "gi://GObject"
import Gtk from "gi://Gtk"
import GLib from "gi://GLib"

export const HomePage = GObject.registerClass(
	{
		GTypeName: "HomePage",
		CssName: "home_page",
		// Signals: {
		// 	"edit-cancel": {},
		// },
		// Template: "resource:///io/github/VardanHeroic/solarbg_gtk/ui/HomePage.ui",
		// Properties: {
		// 	FileName: GObject.ParamSpec.string("file-name", "File Name", "The name of the image file", GObject.ParamFlags.READWRITE, ""),
		// 	StartAltitude: GObject.ParamSpec.double(
		// 		"start",
		// 		"start-altitude",
		// 		"The sun altitude at which image begins to be wallpaper",
		// 		GObject.ParamFlags.READWRITE,
		// 		Number.MIN_SAFE_INTEGER,
		// 		Number.MAX_SAFE_INTEGER,
		// 		0.0,
		// 	),
		// 	EndAltitude: GObject.ParamSpec.double(
		// 		"end",
		// 		"end-altitude",
		// 		"The sun altitude at which image stops to be wallpaper",
		// 		GObject.ParamFlags.READWRITE,
		// 		Number.MIN_SAFE_INTEGER,
		// 		Number.MAX_SAFE_INTEGER,
		// 		0.0,
		// 	),
		// },
	},
	class extends Gtk.Box {
		constructor() {
			super()
			// onEditCancel(_button) {
			// 	this.emit("edit-cancel")
			// }
			const label = new Gtk.Label({ label: "sdalkj;f" })
			this.append(label)
			for (let index = 0; index < 5; index++) {
				const button = new Gtk.Button({
					label: index.toString(),
				})
				button.connect("clicked", () => {
					button.activate_action("win.change-view", new GLib.Variant("s", "edit"))
				})
				// button.set_action_name = "win.change-view"
				// button.set_action_target = "edit"
				this.append(button)
			}
		}
	},
)
