function url2host(url) {
	let u = new URL(url)
	return u.host
}

var IPlist = {}

chrome.webRequest.onCompleted.addListener(
	(details) => {
		IPlist[url2host(details.url)] = details.ip;
		return;
	}, {
	urls: [],
	types: ["main_frame"]
}, []
);

chrome.contextMenus.create({
	title: "显示/关闭 当前页面的IP",
	id: "wsip",
	onclick: turn_on_off
});

function turn_on_off(info, tab) {
	console.info(tab)
	chrome.tabs.sendMessage(tab.id, {
		method: "trigger"
	})
}

chrome.extension.onMessage.addListener(
	(request, sender, callback) => {
		let host = url2host(sender.url)
		let ip = IPlist[host]
		let location = ""
		switch (request.method) {
			case "getIP":
				$.ajax({
					url: "https://clientapi.ipip.net/browser/chrome?ip=" + ip,
					type: 'get',
					data: {},
					dataType: 'json',
					success: (response) => {
						if (response.ret == 0) {
							if (response.data.city != "") { location = response.data.country + '-' + response.data.city; }
							else {
								location = response.data.country
							}
							chrome.tabs.sendMessage(sender.tab.id, {
								method: "location",
								status: "success",
								location: location
							}, (r) => {
								//console.info(r)
							})
						}
					},
					error: (response) => {
						console.info(response)
						chrome.tabs.sendMessage(sender.tab.id, {
							status: "failed",
							location: ""
						}, (r) => {
							console.info(r)
						})
					}
				});
				setTimeout(() => {
					callback({
						ip: ip,
						location: location
					})
				}, 2000)
				return true
			default:
				console.info("unknown method from " + sender.tab.id + " at " + sender.url)
				break
		}
	}
)