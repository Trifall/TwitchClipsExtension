let debugLog = async (message, devOnly) => {
	if (devOnly != undefined && getDevelopment()) {
		console.log('[Clips-Helper] ' + message);
	} else if (devOnly && !getDevelopment()) return;
	else console.log('[Clips-Helper] ' + message);
};

function getOccurrence(array, value) {
	return array.filter((v) => v === value).length;
}

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

		debugLog('{Warning} ' + duplicate_message);

		// send a duplicate notification warning
		dupeNotif(duplicate_message);
	}
};

// copy text to clipboard hack
function copyTextToClipboard(text) {
	var copyFrom = document.createElement('textarea');
	copyFrom.textContent = text;
	document.body.appendChild(copyFrom);
	copyFrom.select();
	document.execCommand('copy');
	copyFrom.blur();
	document.body.removeChild(copyFrom);
	debugLog('Copied to clipboard: ' + text, true);
}

// promise sleep function
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
