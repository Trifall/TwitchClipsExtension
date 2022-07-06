chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	// console.log(
	// 	sender.tab
	// 		? 'from a content script:' + sender.tab.url
	// 		: 'from the extension'
	// );
	if (request.type != 'notification') return;

	if (request.title == null || request.message == null) return;

	if (request.title == '' || request.message == '') return;

	// console.log(
	// 	'[Clips-Helper] ' +
	// 		'Notification: ' +
	// 		request.title +
	// 		' - ' +
	// 		request.message
	// );
	chrome.notifications.create('clips-helper-notif', {
		type: 'basic',
		iconUrl: 'images/logo_48.png',
		title: request.title,
		message: request.message,
		priority: 2,
	});
	// send response data is ok
	sendResponse({ data: '[Clips-Helper] Service Worker Response: Success' });
	return true;
});
