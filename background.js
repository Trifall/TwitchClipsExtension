chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log(
		sender.tab
			? 'from a content script:' + sender.tab.url
			: 'from the extension'
	);
	if (request.type != 'notification') return;

	if (request.title == null || request.message == null) return;

	if (request.title == '' || request.message == '') return;

	chrome.notifications.create('clips-helper-popup', {
		type: 'basic',
		iconUrl: 'images/get_started48.png',
		title: request.title,
		message: request.message,
		priority: 2,
	});
	// send response data is ok
	sendResponse({ data: 'ok' });
	return true;
});
