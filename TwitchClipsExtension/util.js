/**
 * @fileoverview File contains the utility functions for the extension
 * 	- Logging function, Duplicate check function, Copy to clipboard function, Sleep function
 */

/**
 * @description Logging handler function to check whether the extension is in development mode or not
 * @param {*} messagethe message to be logged
 * @param {*} [devOnly] (optional) whether the message should only be logged if the extension is in development mode
 * @return {void} void
 */
let debugLog = async (message, devOnly) => {
	if (devOnly != undefined && getDevelopment()) {
		console.log('[Clips-Helper] ' + message);
	} else if (devOnly && !getDevelopment()) return;
	else console.log('[Clips-Helper] ' + message);
};

function getElementByXpath(path) {
	return document.evaluate(
		path,
		document,
		null,
		XPathResult.FIRST_ORDERED_NODE_TYPE,
		null
	).singleNodeValue;
}

/**
 * @description gets the number of occurrences of a value in an array
 * @param {*} array the array to be searched
 * @param {*} value the value to be searched for
 * @return {*} returns the number of occurrences of the value in the array
 */
let getOccurrence = (array, value) => {
	return array.filter((v) => v === value).length;
};

/**
 * @description Check for duplicate titles and display a warning notification if there are any
 * @param {*} clip_titles the array of clip titles to be checked
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

/**
 * @description Copies the text argument onto the user's clipboard
 * @param {*} text the text string to be copied
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

/**
 * @description Function to sleep for a specified amount of time
 * @param {*} ms amount in milliseconds to wait
 * @return {*} promise resolves after ms milliseconds
 */
let sleep = (ms) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};
