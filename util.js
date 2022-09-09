/*
	Function: Logging handler function to check whether the extension is in development mode or not
	Parameters: message - the message to be logged, devOnly (optional) - whether the message should only be logged if the extension is in development mode
	Returns: None
	Notes: None
*/
let debugLog = async (message, devOnly) => {
	if (devOnly != undefined && getDevelopment()) {
		console.log('[Clips-Helper] ' + message);
	} else if (devOnly && !getDevelopment()) return;
	else console.log('[Clips-Helper] ' + message);
};

/*
	Function: gets the number of occurrences of a value in an array
	Parameters: array - the array to be searched, value - the value to be searched for
	Returns: the number of occurrences of the value in the array
	Notes: Used for duplication checking of the titles
*/
let getOccurrence = (array, value) => {
	return array.filter((v) => v === value).length;
};

/*
	Function: Check for duplicate titles and return a warning message if there are any
	Parameters: clip_titles - the array of titles to be checked
	Returns: None
	Notes: Logs the warning message to the console, displays a notification if there are any duplicates; otherwise, returns nothing
*/
let duplicateCheck = (clip_titles) => {
	let clip_duplicate_titles = [];
	let clip_duplicate_titles_counts = [];

	// check for duplicates in the titles
	clip_titles.forEach((title) => {
		if (!clip_duplicate_titles.includes(title)) {
			let value = getOccurrence(clip_titles, title);
			if (value > 1) {
				clip_duplicate_titles.push(title);
				clip_duplicate_titles_counts.push(value);
			}
		}
	});

	// if there are duplicates found
	if (clip_duplicate_titles.length > 0) {
		let duplicate_message = 'Duplicate clip titles found: ';

		// create the warning duplicate message
		for (var i = 0; i < clip_duplicate_titles.length; i++) {
			//if last iteration
			if (i == clip_duplicate_titles.length - 1)
				duplicate_message +=
					"'" +
					clip_duplicate_titles[i] +
					"' [" +
					clip_duplicate_titles_counts[i] +
					']';
			else
				duplicate_message +=
					"'" +
					clip_duplicate_titles[i] +
					"' [" +
					clip_duplicate_titles_counts[i] +
					'], ';
		}

		// send a duplicate notification warning
		dupeNotif(duplicate_message);
	}
};

/*
	Function: Copies the text argument onto the user's clipboard
	Parameters: text - the text to be copied
	Returns: None
	Notes: Hacky way of copying text to the clipboard
*/
let copyTextToClipboard = (text) => {
	var copyFrom = document.createElement('textarea');
	copyFrom.textContent = text;
	document.body.appendChild(copyFrom);
	copyFrom.select();
	document.execCommand('copy');
	copyFrom.blur();
	document.body.removeChild(copyFrom);
	debugLog('Copied to clipboard: ' + text, true);
};

/*
	Function: Promisified sleep function
	Parameters: ms - the number of milliseconds to sleep
	Returns: Promise
	Notes: None
*/
let sleep = (ms) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};
