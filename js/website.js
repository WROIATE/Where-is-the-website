if (sessionStorage["IPstatus"] === undefined)
	sessionStorage.setItem("IPstatus", "on")

chrome.runtime.onMessage.addListener(
	function (request, sender, callback) {
		switch (request.method) {
			case "location":
				let location = request.location
				if ($("#chrome-website-location").text() == "") {
					$("#chrome-website-location").text(location)
				}
				callback({
					status: "success"
				})
				break
			case "trigger":
				IPstatus = sessionStorage["IPstatus"]
				switch (IPstatus) {
					case "on":
						console.log("hide",IPstatus)
						hideIP()
						IPstatus = "off"
						break
					case "off":
						console.log("show",IPstatus)
						showIP()
						IPstatus = "on"
						break
					case "none":
						console.log("start",IPstatus)
						startIP()
						IPstatus = "on"
						break
				}
				sessionStorage.setItem("IPstatus", IPstatus)
				break
			default:
				break
		}

	}
)

function startIP() {
	chrome.extension.sendMessage({
		method: "getIP"
	}, (response) => {
		let location = response.location
		let ip = response.ip
		$("body").append('<div id="chrome-website-ip" ><div id="chrome-website-location">' + location + '</div><div id="chrome-website-address">' + ip + '</div></div>');
		// double click copy IP Address
		$("#chrome-website-ip").on('dblclick', () => {
			copy("chrome-website-address");
			$("#chrome-website-address").text("Copied!")
			setTimeout(() => { $("#chrome-website-address").text(ip) }, 1500);
		});
	})
}

function hideIP() {
	$("#chrome-website-ip").css("display", "none")
}

function showIP() {
	$("#chrome-website-ip").css("display", "inline-block")
}

function copy(id) {
	let text = $("#" + id).text()
	let $temp = $("<input>");
	$("body").append($temp);
	$temp.val(text).select();
	document.execCommand("copy");
	$temp.remove();
}


$(document).ready(
	function () {
		if (sessionStorage["IPstatus"] == "on") startIP()
		else sessionStorage.setItem("IPstatus", "none")
	}
);
