/*
	Function: Background listener for browser notification handling
	Parameters: request, sender, sendResponse
	Returns: true, if valid request
	Notes: None
*/
chrome.runtime.onMessage.addListener(async function (
	request,
	sender,
	sendResponse
) {
	// if the request is not a notification, return
	if (request.type != 'notification') return;

	// if the request is missing the appropriate fields, return
	if (
		request.title == null ||
		request.message == null ||
		request.notif_name == null
	)
		return;

	// if the request fields are empty, return
	if (request.title == '' || request.message == '' || request.notif_name == '')
		return;

	// generate a random number so the browser notification isn't flagged as the same notification
	let random_number = Math.floor(Math.random() * 100000) + 1;

	// create the chrome notification with the respective fields
	chrome.notifications.create(request.notif_name + '_' + random_number, {
		type: 'basic',
		iconUrl: 'images/logo_48.png',
		title: request.title,
		message: request.message,
		priority: 2,
	});

	// send response back to the content script that the notification was successfully created
	sendResponse({ data: 'Service Worker Notification: Success' });
	// return true to verify the completion of the listener function
	return true;
});
