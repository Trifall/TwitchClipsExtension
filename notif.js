/**
 * @fileoverview Contains all of the notification functions
 */

/**
 * @description error notification function that sends a message to the background service worker to create a notification
 * @param {*} message the error message to be displayed in the notification
 */
let errorNotif = async (message) => {
	let notif_object = {
		notif_name: 'clips-helper-error-notif',
		type: 'notification',
		title: 'Clips Helper - Error',
		message: message,
	};

	chrome?.runtime?.sendMessage(notif_object, function (response) {
		debugLog(response.data, true);
	});

	debugLog('{Error} ' + message);

	debugLog('(Finish) No clips selected on the dashboard.');
};

/**
 * @description success notification function that sends a message to the background service worker to create a notification
 * @param {*} links_length the number of links that were successfully compiled
 */
let successNotif = async (links_length) => {
	let notif_object = {
		notif_name: 'clips-helper-success-notif',
		type: 'notification',
		title: 'Clips Helper - Completed',
		message: 'Copied ' + links_length + ' clip link(s) to clipboard',
	};

	chrome?.runtime?.sendMessage(notif_object, function (response) {
		debugLog(response.data, true);
	});

	debugLog(notif_object.message);
};

/**
 * @description sends a message to the background service worker to create a duplicate warning notification
 * @param {*} duplicate_message the duplicate message to be displayed in the notification
 */
let dupeNotif = async (duplicate_message) => {
	let notif_object = {
		notif_name: 'clips-helper-dupe-notif',
		type: 'notification',
		title: 'Clips Helper - Warning',
		message: duplicate_message,
	};

	// send the notification to the background service worker
	chrome?.runtime?.sendMessage(notif_object, function (response) {
		debugLog(response.data, true);
	});

	// log the notification to the console
	debugLog('{Warning} ' + duplicate_message);
};
