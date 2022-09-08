let createButton = async (ButtonDiv) => {
	// button for link gathering
	var button = document.createElement('button');
	button.style.border = '2px solid #3aa757';
	button.style.marginRight = '5px';
	button.style.radius = '25px';
	button.style.padding = '5px';
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
