/**
 * @fileoverview Contains the function for adding the button to the dashboard page
 */

/**
 * @description Creates the button for the dashboard page, called after the page has been loaded
 * @param {*} ButtonDiv The div element that the button will be inserted into
 */
let createButton = async (ButtonDiv) => {
	// button for link gathering
	var button = document.createElement('button');
	button.style.border = '2px solid #3aa757';
	button.style.marginRight = '5px';
	button.style.radius = '25px';
	button.style.padding = '5px';
	button.style.background = '#3c3c44';
	button.style.borderRadius = '1rem';
	button.innerHTML = 'Compile Clip Links';
	button.onclick = function () {
		clip_links = [];
		clip_titles = [];
		debugLog('(Start) Starting to compile clip links...');
		grabClips();
	};
	//insert the button into the ButtonDiv at the top
	ButtonDiv.insertBefore(button, ButtonDiv.firstChild);
};
