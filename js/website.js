chrome.runtime.onMessage.addListener(
	function (request, sender, callback) {
		let location = request.location
		if ($("#chrome-website-location").text() == "") {
			$("#chrome-website-location").text(location)
		}
		callback({
			status: "success"
		})
	}
)

function showIP() {
	chrome.extension.sendMessage({
		method: "getIP"
	}, (response) => {
		let location = response.location
		let ip = response.ip
		$("body").append('<div title="' + "test" +
			'" id="chrome-website-ip" ><div id="chrome-website-location">' + location + '</div><div id="chrome-website-address">' + ip + "</div>" +
			'</div>');
		// double click copy IP Address
		$("#chrome-website-ip").on('dblclick', function () {
			copy("chrome-website-address");
			$("#chrome-website-address").text("Copied!")
			setTimeout(() => { $("#chrome-website-address").text(ip) }, 1500);
		});
	})
}

function copy(id) {
	let text = $("#" + id).text()
	let $temp = $("<input>");
	$("body").append($temp);
	$temp.val(text).select();
	document.execCommand("copy");
	$temp.remove();
}

$(document).ready(showIP);