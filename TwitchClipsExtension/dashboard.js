/**
 * @fileoverview The primary content script for the extension.
 * 	- Calls the creation of the button on the dashboard page after the page is fully loaded
 * 	- Grabs the links from the selected clips on the dashboard page
 * 	- Copies the links to the clipboard
 *  - Sends a notification to the user with the respective result
 * @author
 * 	- @name: 	Jerren
 * 	- @github: https://github.com/Trifall
 */

window.addEventListener(
	'load',
	function load(event) {
		window.removeEventListener('load', load, false); //remove listener, no longer needed
		main();
	},
	false
);

/** @global Development mode flag */
const development = false;

/** @global Contains the links of all of the clips */
var clip_links = [];
/** @global Contains the titles of all of the clips*/
var clip_titles = [];

/**
 * @description  Entry point function. Called when the page is fully loaded.
 */
async function main() {
	// init div selection
	var ButtonDiv;

	// if its not there, wait 1 second and try again
	do {
		await sleep(50);
		const button = document.querySelectorAll('button[aria-label="More"]')[0];
		// get the parent div of the button
		if (!button) {
			debugLog('More button not found, waiting 1 second and trying again');
			await sleep(1000);
			continue;
		}

		// get the parent div of the button
		ButtonDiv = button.parentElement;
	} while (ButtonDiv == null);

	debugLog('Extension Initialized');
	debugLog('-- DEVELOPMENT MODE --', true);
	// create the compile button
	createButton(ButtonDiv);
}

/**
 * @description Grabs the selected clips via the checkboxes and calls the grabClipLinks function after all the appropriate button elements are found
 * @return {void} void
 */
async function grabClips() {
	// get the element of the clip list panel
	let simplebar_elements = document.getElementsByClassName('simplebar-content');
	let clips_panel_list = simplebar_elements[simplebar_elements.length - 1].firstChild;
	if (!clips_panel_list) {
		errorNotif('Clips panel not found.');
		debugLog('ERROR: Clips panel not found.');
		return;
	}

	let clips_buttons = []; // for storing the HTMLElements of the clip buttons
	let clips_indexes = []; // for storing the indexes of the buttons

	var clip_panels = clips_panel_list.children; // the array of the individual clip panels

	//print out all the children of the clips_panel_list
	debugLog('clip_panels: ' + clip_panels, true);

	if (!clip_panels) {
		errorNotif('No clips found on the dashboard.');
		debugLog('ERROR: No clips found on the dashboard.');
		return;
	}
	// get the button elements from each of the clicked clips
	for (var i = 0; i < clip_panels.length - 1; i++) {
		// iterate over each panel
		var clip_panel = clip_panels[i];
		debugLog('clip_panel [' + i + ']: ' + clip_panel, true);

		// select the button element
		var clip_button = clip_panel.querySelector('[role="button"]');

		// select the checkbox element
		// var clip_checkbox_div = clip_button.querySelector(
		// 	'div > div.ScColumn-sc-tzah5l-0.bLLxGl.tw-col > div > div > div.Layout-sc-nxg1ff-0.ScCheckboxLayout-sc-1qewoje-0.fcPbos.lfrrrb.tw-checkbox'
		// );

		// get the input checkbox element from the parent div
		var clip_input = clip_panel.querySelector('.tw-checkbox__input');

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
		errorNotif('No clips selected on the dashboard.\nSelect 1 or more clips and try again');
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

/**
 * @description Uses the selected buttons to open each panel of the selected clips and grab the links from the generated link elements
 * 				- Had to make the clip_button_clickable variable select a child element because for some reason the button element itself was not clickable
 * @param {*} clips_indexes the indexes of the selected clips
 * @param {*} clips_panels_list the HTMLElement of the list of clip panels
 * @param {*} clips_buttons the HTMLElements of the selected clip buttons
 */
async function grabClipLinks(clips_indexes, clips_panels_list, clips_buttons) {
	// iterate over each clip button
	for (var i = 0; i < clips_buttons.length; i++) {
		await sleep(10);

		var clip_button = clips_buttons[i];

		// get the title of the current clip
		let clip_title = clip_button.querySelector('h5').innerHTML;

		// add it to the array for later duplicate checking
		clip_titles.push(clip_title);

		// get the clickable element of the button
		let clip_button_clickable = clip_button.getElementsByTagName('div')[0].getElementsByTagName('div')[0].getElementsByTagName('div')[0];

		// click the element to open the clip panel
		clip_button_clickable.click();

		debugLog('Opening Clip Panel with index [' + i + ']', true);

		// Wait for the clip panel to open after clicking it by checking if the 'data-a-target' attribute exists
		while (clips_panels_list.children[clips_indexes[i]].hasAttribute('data-a-target')) {
			console.log('clip index current: ' + clips_indexes[i]);
			debugLog('Waiting for clip panel to open');
			await sleep(10);
		}

		// get the 'a' element that contains the clip link
		let clip_link_elements = clips_panels_list.children[clips_indexes[i]].querySelectorAll('a');

		for (let j = 0; j < clip_link_elements.length; j++) {
			// check if href link contains 'https://clips.twitch.tv/'
			if (clip_link_elements[j].getAttribute('href')) {
				if (clip_link_elements[j].getAttribute('href').toLowerCase().includes('https://clips.twitch.tv/')) {
					// if it does, set the clip_link_element to the current element
					clip_link_element = clip_link_elements[j];
					debugLog('Found clip link element', true);
					break;
				}
			}

			debugLog('clip_link_elements[' + j + ']: ' + clip_link_elements[j].innerHTML, true);
		}

		if (development) {
			// print children of div element clip_link_element
			// for (let i = 0; i < clip_link_element.children.length; i++) {
			// 	debugLog('clip_link_element child: ' + clip_link_element.children[i].innerHTML, true);
			// }
		}

		// debugLog('clip_link_element: ' + clip_link_element, true);

		// if there is no 'a' element, throw error
		if (clip_link_element == null) {
			throw console.error('[Clips-Helper] ' + 'clip_link_element is null, most likely a loading issue');
		}

		// get the href value of the 'a' element
		let clip_link = clip_link_element.getAttribute('href');

		// remove everything in the string after the first '?'
		clip_link = clip_link.substring(0, clip_link.indexOf('?'));

		// debugLog('clip_link: ' + clip_link, true);

		// add clip link to the array
		clip_links.push(clip_link);

		//if last clip panel in the list, then close the panel
		if (i == clips_buttons.length - 1) {
			clip_button_clickable.click();

			await sleep(5);

			debugLog('Closing Clip Panel with index [' + i + ']', true);
			// debugLog('clip_button_clickable: ' + clip_button_clickable.className, true);
		}
	}

	// Check for duplicate clip titles
	duplicateCheck(clip_titles);
}

/**
 * @description Getter method for the development variable
 * @return {boolean} the value of the development variable
 */
let getDevelopment = () => {
	return !!development;
};
