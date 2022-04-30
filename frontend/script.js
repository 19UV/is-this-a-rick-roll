"use strict";

// Source: https://ihateregex.io/expr/url/
const URL_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)$/;

class App {
	constructor() {
		this.url_input = document.getElementById("url");
		this.response = document.getElementById("response");

		if(!this.url_input || !this.response) {
			throw new Error("Unable to Located all DOM Elements");
		}

		this.url_input.addEventListener("keypress", ((e) => {
			if(e.key == "Enter") {
				e.preventDefault();

				this.check_url();
			}
		}).bind(this));
	};

	async check_url() {
		this.response.className = "normal_text";
		this.response.innerHTML = "Checking...";
		
		const url = this.url_input.value.trim();
		if(!URL_REGEX.test(url)) { // Invalid URL
			this.response.className = "error_text";
			this.response.innerHTML = "Error: Please Enter a Valid URL";
			return;
		}

		const query_string = new URLSearchParams({ url }).toString();
		const request_url = `${document.location.origin}/check_url?${query_string}`;
		
		const response = await fetch(request_url);
		if(!response.ok) {
			console.error("Request Failed");
			console.log(await response.text());
			return;
		}

		const json = await response.json();
		if(json.value) { // Rick Roll Detected
			this.response.className = "warn_text";
			this.response.innerHTML = "Rick Roll Detected";
		} else {
			this.response.className = "normal_text";
			this.response.innerHTML = "You're Good, No Rick Roll Here (&#10004;)";
		}
	}
};

window.addEventListener("load", () => { new App(); });