window.addEventListener(
	'load',
	function load(event) {
		window.removeEventListener('load', load, false); //remove listener, no longer needed
		main();
	},
	false
);

const development = false;

var clip_links = [];
var clip_titles = [];

async function main() {
	// init div selection
	var ButtonDiv;

	// if its not there, wait 1 second and try again
	do {
		await sleep(50);
		ButtonDiv = document.querySelector(
			'#root > div.Layout-sc-nxg1ff-0.jNlVGw > div > div > div.Layout-sc-nxg1ff-0.aleoz.sunlight-default-root__root-wrapper > div > main > div > div.simplebar-scroll-content > div > div > div > div > div.Layout-sc-nxg1ff-0.imwtan.clmgr-table-wrap > div.Layout-sc-nxg1ff-0.gaKKxR > div > div.Layout-sc-nxg1ff-0.cyXQoi > div:nth-child(2)'
		);
	} while (ButtonDiv == null);

	debugLog('Extension Initialized');
	debugLog('-- DEVELOPMENT MODE --', true);
	// create the compile button
	createButton(ButtonDiv);
}

async function grabClips() {
	// get the element of the clip list panel
	let clips_panel_list = document.querySelector(
		'#root > div.Layout-sc-nxg1ff-0.jNlVGw > div > div > div.Layout-sc-nxg1ff-0.aleoz.sunlight-default-root__root-wrapper > div > main > div > div.simplebar-scroll-content > div > div > div > div > div.Layout-sc-nxg1ff-0.imwtan.clmgr-table-wrap > div.Layout-sc-nxg1ff-0.fQeqDH.clmgr-table-inner > div > div.simplebar-scroll-content > div > div'
	);

	let clips_buttons = []; // for storing the HTMLElements of the clip buttons
	let clips_indexes = []; // for storing the indexes of the buttons

	var clip_panels = clips_panel_list.children; // the array of the individual clip panels

	//print out all the children of the clips_panel_list
	debugLog('clip_panels: ' + clip_panels, true);

	// get the button elements from each of the clicked clips
	for (var i = 0; i < clip_panels.length - 1; i++) {
		// iterate over each panel
		var clip_panel = clip_panels[i];

		// select the button element
		var clip_button = clip_panel.querySelector('button');

		// select the checkbox element
		var clip_checkbox_div = clip_button.querySelector(
			'div > div.ScColumn-sc-tzah5l-0.bLLxGl.tw-col > div > div > div.Layout-sc-nxg1ff-0.ScCheckboxLayout-sc-1qewoje-0.fcPbos.lfrrrb.tw-checkbox'
		);

		// get the input checkbox element from the parent div
		var clip_input = clip_checkbox_div.firstChild;

		debugLog('clip_input [' + i + ']: ' + clip_input.checked, true);

		// if clip_input is checked, add the respective clip_button to the clips_buttons array
		if (clip_input.checked) {
			clips_buttons.push(clip_button);
			clips_indexes.push(i);
		}
	}

	debugLog('clips_buttons: ' + clips_buttons, true);

	// if there are no clips selected, return an error and exit
	if (clips_buttons.length == 0) {
		errorNotif(
			'No clips selected on the dashboard.\nSelect 1 or more clips and try again'
		);
		return;
	}

	debugLog('Clip button count: ' + clips_buttons.length, true);

	// grab the links from each of the clip panels that were checked
	await grabClipLinks(clips_indexes, clips_panel_list, clips_buttons);

	// print out the links and add them to the copy string for the clipboard
	if (clip_links.length > 0) {
		debugLog('Clip links found: ' + clip_links.length, true);
		let copyTextString = '';
		for (let i = 0; i < clip_links.length; i++) {
			debugLog('Clip link: ' + clip_links[i], true);
			// if last element, dont add new line
			if (i == clip_links.length - 1) copyTextString += clip_links[i];
			else copyTextString += clip_links[i] + '\n';
		}

		// copy the links to the clipboard
		copyTextToClipboard(copyTextString);

		// send a success notification
		successNotif(clip_links.length);
	} else debugLog('No Clip links found');

	// log the end of the process
	debugLog('(Finish) Clip links compiled');
}

async function grabClipLinks(clips_indexes, clips_panels_list, clips_buttons) {
	// get the clip_links from the clips_buttons

	// iterate over each clip button
	for (var i = 0; i < clips_buttons.length; i++) {
		await sleep(10);

		var clip_button = clips_buttons[i];

		// get the title of the current clip
		let clip_title = clip_button.querySelector(
			'div > div.ScColumn-sc-tzah5l-0.bLLxGl.tw-col > div > h5'
		).innerHTML;

		// add it to the array for later duplicate checking
		clip_titles.push(clip_title);

		// get the clickable element of the button
		let clip_button_clickable = clip_button.querySelector(
			'div > div.ScColumn-sc-tzah5l-0.bLLxGl.tw-col > div'
		);

		// click the element to open the clip panel
		clip_button_clickable.click();

		debugLog('Opening Clip Panel with index [' + i + ']', true);

		// Wait for the clip panel to open after clicking it by checking if the 'data-a-target' attribute exists
		while (
			clips_panels_list.children[clips_indexes[i]].hasAttribute('data-a-target')
		) {
			debugLog('Waiting for clip panel to open');
			await sleep(10);
		}

		// get the 'a' element that contains the clip link
		let clip_link_element = clips_panels_list.children[
			clips_indexes[i]
		].querySelector(
			'div > div.Layout-sc-nxg1ff-0.koTxja > div.Layout-sc-nxg1ff-0.hiuuyA > div:nth-child(3) > a'
		);

		// if there is no 'a' element, throw error
		if (clip_link_element == null) {
			throw console.error(
				'[Clips-Helper] ' +
					'clip_link_element is null, most likely a loading issue'
			);
		}

		// get the href value of the 'a' element
		let clip_link = clip_link_element.getAttribute('href');

		// remove everything in the string after the first '?'
		clip_link = clip_link.substring(0, clip_link.indexOf('?'));

		debugLog('clip_link: ' + clip_link, true);

		// add clip link to the array
		clip_links.push(clip_link);

		//if last clip panel in the list, then close the panel
		if (i == clips_buttons.length - 1) {
			let close_button = clips_panels_list.children[
				clips_indexes[i]
			].querySelector(
				'div > div.Layout-sc-nxg1ff-0.koTxja > div.Layout-sc-nxg1ff-0.ScAttachedTooltipWrapper-sc-v8mg6d-0.hOVSHb > div.Layout-sc-nxg1ff-0.kxtmAi > button'
			);
			if (close_button != null) close_button.click();
		}
	}

	// Check for duplicate clip titles
	duplicateCheck(clip_titles);
}

let getDevelopment = () => {
	return development;
};
