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

	debugLog('(Finish) No clips selected on the dashboard.');
};

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

let dupeNotif = async (duplicate_message) => {
	let notif_object = {
		notif_name: 'clips-helper-dupe-notif',
		type: 'notification',
		title: 'Clips Helper - Warning',
		message: duplicate_message,
	};

	// console.log('sending notif for chrome');
	chrome?.runtime?.sendMessage(notif_object, function (response) {
		debugLog(response.data, true);
	});
};
