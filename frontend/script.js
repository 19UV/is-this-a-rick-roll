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
		const url = this.url_input.value.trim();
		if(!URL_REGEX.test(url)) { // Invalid URL
			// throw new Error("Invalid Url");
			alert("Invalid Url");
			return;
		}

		const query_string = new URLSearchParams({ url }).toString();
		const request_url = `${document.location.origin}/check_url?${query_string}`;
		
		console.log(request_url);
		const response = await fetch(request_url);
		if(!response.ok) {
			console.error("Request Failed");
			console.log(await response.text());
			return;
		}

		const json = await response.json();
		this.response.innerHTML = json.value ? "Yes" : "No";
		console.log(json);
	}
};

window.addEventListener("load", () => { new App(); });