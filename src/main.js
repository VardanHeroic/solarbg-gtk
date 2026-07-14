import "gi://Gdk?version=4.0"
import "gi://Gtk?version=4.0"

import { SolarbgApplication } from "./Application.js"

export function main(argv) {
	return new SolarbgApplication({ "application-id": pkg.name }).run(argv)
}
