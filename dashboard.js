window.addEventListener(
	'load',
	function load(event) {
		window.removeEventListener('load', load, false); //remove listener, no longer needed
		main();
	},
	false
);

var clip_links = [];
var clip_titles = [];

async function main() {
	let buttonSelector =
		'#root > div.Layout-sc-nxg1ff-0.jNlVGw > div > div > div.Layout-sc-nxg1ff-0.aleoz.sunlight-default-root__root-wrapper > div > main > div > div.simplebar-scroll-content > div > div > div > div > div.Layout-sc-nxg1ff-0.imwtan.clmgr-table-wrap > div.Layout-sc-nxg1ff-0.gaKKxR > div > div.Layout-sc-nxg1ff-0.cyXQoi > div:nth-child(2)';

	var ButtonDiv = document.querySelector(buttonSelector);

	while (ButtonDiv == null) {
		await sleep(500);
		ButtonDiv = document.querySelector(buttonSelector);
	}

	console.log('[Clips-Helper] ' + 'extension is running');
	//console.log('[Clips-Helper] ' + ButtonDiv.innerHTML);

	var button = document.createElement('button');
	button.style.border = '2px solid #3aa757';
	button.style.marginRight = '5px';
	button.style.radius = '25px';
	button.style.padding = '5px';
	button.innerHTML = 'Compile Clip Links';
	button.onclick = function () {
		clip_links = [];
		clip_titles = [];
		console.log('[Clips-Helper] (Start)' + 'Starting to compile clip links...');
		grabClips();
	};
	//insert the button into the ButtonDiv at the top
	ButtonDiv.insertBefore(button, ButtonDiv.firstChild);
}

async function grabClips() {
	let clips_panel_list = document.querySelector(
		'#root > div.Layout-sc-nxg1ff-0.jNlVGw > div > div > div.Layout-sc-nxg1ff-0.aleoz.sunlight-default-root__root-wrapper > div > main > div > div.simplebar-scroll-content > div > div > div > div > div.Layout-sc-nxg1ff-0.imwtan.clmgr-table-wrap > div.Layout-sc-nxg1ff-0.fQeqDH.clmgr-table-inner > div > div.simplebar-scroll-content > div > div'
	);

	let clips_buttons = [];
	let clips_indexes = [];

	var clip_panels = clips_panel_list.children;

	//print out all the children of the clips_panel_list
	// console.log('[Clips-Helper] ' + 'clip_panels: ' + clip_panels);

	// get the button elements from each of the clicked clips
	for (var i = 0; i < clip_panels.length - 1; i++) {
		var clip_panel = clip_panels[i];

		var clip_button = clip_panel.querySelector('button');

		var clip_checkbox_div = clip_button.querySelector(
			'div > div.ScColumn-sc-tzah5l-0.bLLxGl.tw-col > div > div > div.Layout-sc-nxg1ff-0.ScCheckboxLayout-sc-1qewoje-0.fcPbos.lfrrrb.tw-checkbox'
		);
		//console.log('[Clips-Helper] inputhtml: ' + clip_button);

		// set clip_input to the first child of clip_button
		var clip_input = clip_checkbox_div.firstChild;
		// console.log(
		// 	'[Clips-Helper] ' + 'clip_input [' + i + ']: ' + clip_input.checked
		// );
		// if clip_input is checked, add the respective clip_button to the clips_buttons array
		if (clip_input.checked) {
			clips_buttons.push(clip_button);
			clips_indexes.push(i);
		}
	}

	if (clips_buttons.length == 0) {
		let notif_object = {
			notif_name: 'clips-helper-error-notif',
			type: 'notification',
			title: 'Clips Helper - Error',
			message:
				'No clips selected on the dashboard.\nSelect 1 or more clips and try again.',
		};

		chrome.runtime.sendMessage(notif_object, function (response) {
			console.log(response.data);
		});

		console.log(
			'[Clips-Helper] (Finish) ' + 'No clips selected on the dashboard.'
		);
		return;
	}

	// console.log('[Clips-Helper] ' + 'Clip button count: ' + clips_buttons.length);

	await grabLinks(clips_indexes, clips_panel_list, clips_buttons);

	if (clip_links.length > 0) {
		console.log('[Clips-Helper] ' + 'Clip links found: ' + clip_links.length);
		let copyTextString = '';
		for (let i = 0; i < clip_links.length; i++) {
			// if last element, dont add new line
			if (i == clip_links.length - 1) copyTextString += clip_links[i];
			else copyTextString += clip_links[i] + '\n';
		}
		copyTextToClipboard(copyTextString);
		console.log(
			'[Clips-Helper] ' +
				'Copied ' +
				clip_links.length +
				' clip links to clipboard'
		);

		let notif_object = {
			notif_name: 'clips-helper-success-notif',
			type: 'notification',
			title: 'Clips Helper - Completed',
			message: 'Copied ' + clip_links.length + ' clip link(s) to clipboard',
		};

		// console.log(
		// 	'[Clips-Helper] ' +
		// 		'Notification: ' +
		// 		JSON.stringify(notif_object, null, 2)
		// );

		chrome.runtime.sendMessage(notif_object, function (response) {
			console.log(response.data);
		});
	} else console.log('[Clips-Helper] ' + 'No Clip links found');

	console.log('[Clips-Helper] (Finish) ' + 'Clip links compiled');
}

async function grabLinks(clips_indexes, clips_panels_list, clips_buttons) {
	// get the clip_links from the clips_buttons
	for (var i = 0; i < clips_buttons.length; i++) {
		await sleep(10);
		var clip_button = clips_buttons[i];
		//console.log('[Clips-Helper] ' + 'clip_button: ' + clip_button);
		clip_button.click();
		// console.log(
		// 	'[Clips-Helper] ' + 'Opening Clip Panel with index [' + i + ']'
		// );

		//var clip_link = clips_panels_list.children[]

		let clip_link_element;

		let clip_title = clip_button.querySelector(
			'div > div.ScColumn-sc-tzah5l-0.bLLxGl.tw-col > div > h5'
		).innerHTML;

		clip_titles.push(clip_title);

		while (
			clips_panels_list.children[clips_indexes[i]].hasAttribute('data-a-target')
		) {
			console.log('[Clips-Helper] ' + 'Waiting for element to remove data tag');
			await sleep(100);
		}

		clip_link_element = clips_panels_list.children[
			clips_indexes[i]
		].querySelector(
			'div > div.Layout-sc-nxg1ff-0.koTxja > div.Layout-sc-nxg1ff-0.hiuuyA > div:nth-child(3) > a'
		);

		if (clip_link_element == null) {
			throw console.error(
				'[Clips-Helper] ' +
					'clip_link_element is null, most likely a loading issue'
			);
		}

		let clip_link = clip_link_element.getAttribute('href');
		// remove everything in the string after the first '?'
		clip_link = clip_link.substring(0, clip_link.indexOf('?'));

		// console.log('[Clips-Helper] ' + 'clip_link: ' + clip_link);

		clip_links.push(clip_link);

		// close the clip_panel
		//if last iteration
		if (i == clips_buttons.length - 1) {
			let close_button = clips_panels_list.children[
				clips_indexes[i]
			].querySelector(
				'div > div.Layout-sc-nxg1ff-0.koTxja > div.Layout-sc-nxg1ff-0.ScAttachedTooltipWrapper-sc-v8mg6d-0.hOVSHb > div.Layout-sc-nxg1ff-0.kxtmAi > button'
			);
			if (close_button != null) close_button.click();
		}

		clips_panel_list = document.querySelector(
			'#root > div.Layout-sc-nxg1ff-0.jNlVGw > div > div > div.Layout-sc-nxg1ff-0.aleoz.sunlight-default-root__root-wrapper > div > main > div > div.simplebar-scroll-content > div > div > div > div > div.Layout-sc-nxg1ff-0.imwtan.clmgr-table-wrap > div.Layout-sc-nxg1ff-0.fQeqDH.clmgr-table-inner > div > div.simplebar-scroll-content > div > div'
		);

		// console.log(
		// 	'[Clips-Helper] ' +
		// 		'clips children count: ' +
		// 		clips_panel_list.childElementCount
		// );
		// console.log(
		// 	'[Clips-Helper] ' +
		// 		'clips children length: ' +
		// 		clips_panel_list.children.length
		// );
	}

	let clip_duplicate_titles = [];
	// add duplicate strings in the clip_titles array to the array clip_duplicate_titles
	const alreadySeen = {};

	clip_titles.forEach((str) =>
		alreadySeen[str]
			? clip_duplicate_titles.push(str)
			: (alreadySeen[str] = true)
	);

	// should be fixed TODO: test this, check dupe string imp

	// console.log(
	// 	'[Clips-Helper] dupe titles length: ' + clip_duplicate_titles.length
	// );

	// print out all the duplicate strings
	//console.log('Alreadyseen: ' + alreadySeen);

	if (clip_duplicate_titles.length > 0) {
		let duplicate_message =
			'Duplicate clip titles found: ' + clip_duplicate_titles.join(', ');

		console.log('[Clips-Helper] {Warning} ' + duplicate_message);

		let notif_object = {
			notif_name: 'clips-helper-dupe-notif',
			type: 'notification',
			title: 'Clips Helper - Warning',
			message: duplicate_message,
		};

		// await sleep(200);
		// console.log('sending notif for chrome');
		chrome.runtime.sendMessage(notif_object, function (response) {
			console.log(response.data);
		});
	}
}

// promise sleep function
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// copy text to clipboard hack
function copyTextToClipboard(text) {
	//Create a textbox field where we can insert text to.
	var copyFrom = document.createElement('textarea');

	//Set the text content to be the text you wished to copy.
	copyFrom.textContent = text;

	//Append the textbox field into the body as a child.
	//"execCommand()" only works when there exists selected text, and the text is inside
	//document.body (meaning the text is part of a valid rendered HTML element).
	document.body.appendChild(copyFrom);

	//Select all the text!
	copyFrom.select();

	//Execute command
	document.execCommand('copy');

	//(Optional) De-select the text using blur().
	copyFrom.blur();

	//Remove the textbox field from the document.body, so no other JavaScript nor
	//other elements can get access to this.
	document.body.removeChild(copyFrom);
}
