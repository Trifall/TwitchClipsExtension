window.addEventListener(
	'load',
	function load(event) {
		window.removeEventListener('load', load, false); //remove listener, no longer needed
		//enter here the action you want to do once loaded
		alert('Loaded!');
		main();
	},
	false
);

function main() {
	var ButtonDiv = document.querySelector(
		'#root > div.Layout-sc-nxg1ff-0.jNlVGw > div > div > div.Layout-sc-nxg1ff-0.aleoz.sunlight-default-root__root-wrapper > div > main > div > div.simplebar-scroll-content > div > div > div > div > div.Layout-sc-nxg1ff-0.imwtan.clmgr-table-wrap > div.Layout-sc-nxg1ff-0.gaKKxR > div > div.Layout-sc-nxg1ff-0.cyXQoi > div:nth-child(2)'
	);
	console.log('[Clips-Helper] ' + 'extension is running');
	//console.log('[Clips-Helper] ' + ButtonDiv.innerHTML);

	var button = document.createElement('button');
	button.style.border = '2px solid #3aa757';
	button.style.marginRight = '5px';
	button.style.radius = '25px';
	button.style.padding = '5px';
	button.innerHTML = 'Compile Clip Links';
	button.onclick = function () {
		console.log('[Clips-Helper] ' + 'clicked');
		grabClips();
	};
	//insert the button into the ButtonDiv at the top
	ButtonDiv.insertBefore(button, ButtonDiv.firstChild);
}
// full '#root > div.Layout-sc-nxg1ff-0.jNlVGw > div > div > div.Layout-sc-nxg1ff-0.aleoz.sunlight-default-root__root-wrapper > div > main > div > div.simplebar-scroll-content > div > div > div > div > div.Layout-sc-nxg1ff-0.imwtan.clmgr-table-wrap > div.Layout-sc-nxg1ff-0.fQeqDH.clmgr-table-inner > div > div.simplebar-scroll-content > div > div > div:nth-child(1) > button > div > div.ScColumn-sc-tzah5l-0.bLLxGl.tw-col > div > div > div.Layout-sc-nxg1ff-0.ScCheckboxLayout-sc-1qewoje-0.fcPbos.lfrrrb.tw-checkbox'
async function grabClips() {
	let clips_panel_list = document.querySelector(
		'#root > div.Layout-sc-nxg1ff-0.jNlVGw > div > div > div.Layout-sc-nxg1ff-0.aleoz.sunlight-default-root__root-wrapper > div > main > div > div.simplebar-scroll-content > div > div > div > div > div.Layout-sc-nxg1ff-0.imwtan.clmgr-table-wrap > div.Layout-sc-nxg1ff-0.fQeqDH.clmgr-table-inner > div > div.simplebar-scroll-content > div > div'
	);

	// let clips_panel_list_items = clips_panel_list.querySelectorAll(
	// 	'div > div > div.Layout-sc-nxg1ff-0.koTxja > div.Layout-sc-nxg1ff-0.hiuuyA > div:nth-child(3) > a'
	// );
	// getAttribute('href') <-- do something with this for getting the link after opening the clip

	let clips_buttons = [];

	// //	document.querySelector(
	//     'div:nth-child(3) > button > div > div.ScColumn-sc-tzah5l-0.bLLxGl.tw-col > div > div > div.Layout-sc-nxg1ff-0.ScCheckboxLayout-sc-1qewoje-0.fcPbos.lfrrrb.tw-checkbox'
	// 	);

	var clip_panels = clips_panel_list.children;

	//print out all the children of the clips_panel_list
	console.log('[Clips-Helper] ' + 'clip_panels: ' + clip_panels);

	for (var i = 0; i < clip_panels.length - 1; i++) {
		var clip_panel = clip_panels[i];

		var clip_button = clip_panel.querySelector('button');

		var clip_checkbox_div = clip_button.querySelector(
			'div > div.ScColumn-sc-tzah5l-0.bLLxGl.tw-col > div > div > div.Layout-sc-nxg1ff-0.ScCheckboxLayout-sc-1qewoje-0.fcPbos.lfrrrb.tw-checkbox'
		);
		//console.log('[Clips-Helper] inputhtml: ' + clip_button);

		// set clip_input to the first child of clip_button
		var clip_input = clip_checkbox_div.firstChild;
		console.log(
			'[Clips-Helper] ' + 'clip_input [' + i + ']: ' + clip_input.checked
		);
		// if clip_input is checked, add the respective clip_button to the clips_buttons array
		if (clip_input.checked) {
			clips_buttons.push(clip_button);
		}
	}

	console.log('[Clips-Helper] ' + 'Clip button count: ' + clips_buttons.length);

	//TODO: We have obtained the element objects of all buttons with the respective checkboxes checked.
	//     Now we need to get the links from the buttons.
	//     Got to open up each button through the .click() method.
	//     Then we can get the link from the href attribute of the popout button.
	//     add link to array, deal with later maybe textbox popup idk clipboard
	//     can probably just click the next button in the list, to swap to the next clip, and continue until all done

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

	//console.log('[Clips-Helper] Clips: ' + clips_panel_list.innerHTML);

	// let a_tag_for_clip = document.querySelector("#root > div.Layout-sc-nxg1ff-0.jNlVGw > div > div > div.Layout-sc-nxg1ff-0.aleoz.sunlight-default-root__root-wrapper > div > main > div > div.simplebar-scroll-content > div > div > div > div > div.Layout-sc-nxg1ff-0.imwtan.clmgr-table-wrap > div.Layout-sc-nxg1ff-0.fQeqDH.clmgr-table-inner > div > div.simplebar-scroll-content > div > div > div:nth-child(1) > div > div.Layout-sc-nxg1ff-0.koTxja > div.Layout-sc-nxg1ff-0.hiuuyA > div:nth-child(3) > a");
}
