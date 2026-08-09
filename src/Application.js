import Gtk from "gi://Gtk"
import Gdk from "gi://Gdk"
import GObject from "gi://GObject"
import Gio from "gi://Gio"
import { Window } from "./Window.js"
import "./ThemeEntry.js"
import "./HomePage.js"
import "./EditPage.js"
import "./Theme.js"

Gio._promisify(Gio.File.prototype, "copy_async")
Gio._promisify(Gio.File.prototype, "create_async")
Gio._promisify(Gio.File.prototype, "delete_async")
Gio._promisify(Gio.File.prototype, "enumerate_children_async")
Gio._promisify(Gio.File.prototype, "load_contents_async")
Gio._promisify(Gio.File.prototype, "make_directory_async")
Gio._promisify(Gio.File.prototype, "move_async")
Gio._promisify(Gio.File.prototype, "open_readwrite_async")
Gio._promisify(Gio.File.prototype, "query_info_async")
Gio._promisify(Gio.File.prototype, "replace_contents_async")
Gio._promisify(Gio.File.prototype, "replace_contents_bytes_async", "replace_contents_finish")
Gio._promisify(Gio.File.prototype, "trash_async")

/* Gio.FileEnumerator */
Gio._promisify(Gio.FileEnumerator.prototype, "next_files_async")

/* Gio.InputStream */
Gio._promisify(Gio.InputStream.prototype, "read_bytes_async")

/* Gio.OutputStream */
Gio._promisify(Gio.OutputStream.prototype, "write_bytes_async")

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
