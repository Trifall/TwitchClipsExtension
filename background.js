chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	// console.log(
	// 	sender.tab
	// 		? 'from a content script:' + sender.tab.url
	// 		: 'from the extension'
	// );
	if (request.type != 'notification') return;

	if (
		request.title == null ||
		request.message == null ||
		request.notif_name == null
	)
		return;

	if (request.title == '' || request.message == '' || request.notif_name == '')
		return;

	// console.log(
	// 	'[Clips-Helper] ' +
	// 		'Notification: ' +
	// 		request.title +
	// 		' - ' +
	// 		request.message
	// );

	// generate a random number between 1 and 100000
	let random_number = Math.floor(Math.random() * 100000) + 1;

	chrome.notifications.create(request.notif_name + '_' + random_number, {
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
