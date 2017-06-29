import "./styles/application.css";
import "./styles/backboneforms.css";
import App from "components/App";

document.addEventListener("DOMContentLoaded", () => {
	console.log("ProjectApp starting....");
	const app = new App();
	app.start();
});
