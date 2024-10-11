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
	debugLog('Starting grabClipLinks with global clip_links:', clip_links);
    
	// iterate over each clip button
	for (var i = 0; i < clips_buttons.length; i++) {
			try {
					await sleep(100);
					
					let clip_button = clips_buttons[i];
					let clip_title = clip_button.querySelector('h5').innerHTML;
					debugLog(`Processing clip ${i + 1}/${clips_buttons.length}: ${clip_title}`);
					
					clip_titles.push(clip_title);
					
					let clip_button_clickable = clip_button.getElementsByTagName('div')[0]
							.getElementsByTagName('div')[0]
							.getElementsByTagName('div')[0];
					
					clip_button_clickable.click();
					debugLog(`Clicked panel for clip ${i + 1}`, true);
					
					const child_panel = clips_panels_list.children[clips_indexes[i]];

					while(child_panel.querySelectorAll('a').length < 3) {
						debugLog(`Waiting for clip panel to open`, true);
						await sleep(50);
					}
					
					let clip_link_elements = child_panel.querySelectorAll('a');
					debugLog(`Found ${clip_link_elements.length} potential link elements`);
					
					let clip_link = null;
					for (let j = 0; j < clip_link_elements.length; j++) {
							const href_value = clip_link_elements[j].getAttribute('href');
							debugLog(`href_value: ${href_value}`, true);
							if (href_value && href_value.toLowerCase().includes('https://www.twitch.tv/') && 
									href_value.toLowerCase().includes('/clip/')) {
									debugLog(`passed href_value check for href value: ${href_value}`, true);

									clip_link = href_value;
									debugLog(`Found valid clip link on clip index ${i}`, true);
									break;
							}
					}
					
					if (!clip_link) {
							throw new Error(`No valid clip link found for clip ${i + 1}`);
					}
					
					clip_link = clip_link.substring(0, clip_link.indexOf('?') === -1 ? clip_link.length : clip_link.indexOf('?'));
					clip_links.push(clip_link);
					
					if (i === clips_buttons.length - 1) {
							clip_button_clickable.click();
							await sleep(5);
					}
			} catch (error) {
					console.error(`Error processing clip ${i + 1}:`, error);
					throw error; // Re-throw to stop processing if there's an error
			}
	}
	
	debugLog('Final clip_links array:', clip_links, true);
	duplicateCheck(clip_titles);
	return clip_links; // Explicitly return the array
}

/**
 * @description Getter method for the development variable
 * @return {boolean} the value of the development variable
 */
let getDevelopment = () => {
	return !!development;
};
