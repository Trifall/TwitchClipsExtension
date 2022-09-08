chrome.runtime.onMessage.addListener(async function (
	request,
	sender,
	sendResponse
) {
	if (request.type != 'notification') return;

	if (
		request.title == null ||
		request.message == null ||
		request.notif_name == null
	)
		return;

	if (request.title == '' || request.message == '' || request.notif_name == '')
		return;

	let random_number = Math.floor(Math.random() * 100000) + 1;

	chrome.notifications.create(request.notif_name + '_' + random_number, {
		type: 'basic',
		iconUrl: 'images/logo_48.png',
		title: request.title,
		message: request.message,
		priority: 2,
	});
	// send response data is ok
	sendResponse({ data: 'Service Worker Notification: Success' });
	return true;
});
