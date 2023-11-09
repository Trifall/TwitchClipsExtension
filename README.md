# Twitch Clips Extension
A browser extension for Chrome and Firefox browsers to add extra functionality to the twitch dashboard page for clips.

## Overview

Automatically grab links from the selected twitch clips on the dashboard. (dashboard.twitch.tv/u/<user>/content/clips)

On the dashboard page of Twitch.tv (https://dashboard.twitch.tv/u/<user>/content/clips), you can select multiple clips you have created, but Twitch only provides the option to delete them in bulk.

In order to get the clip link normally, you would have to click each individual clip, then the clip link button, then copy the link.

This extension improves the speed of that process by automatically grabbing all of the clip links from the selected clips via the check-boxes on the left side of the dashboard page, and then copies it to your clipboard.


## Functionality
- Select the clips that have been made via the checkboxes on the individual clips in the dashboard panel.
- Press the 'Compile Clip Links' button.
  - This automatically compiles the clips and grabs the respective link for each selected one.
  ![Dashboard Example Image](https://i.imgur.com/IA1uLNd.png)
- All of the clip links are then copied to the clipboard after they have been retrieved
  - Will send a chrome notification that displays the result. Warns for clips that have the same title, as those may be problematic for overwriting files, etc.

## Installation

[Chrome Store Page](https://chrome.google.com/webstore/detail/twitch-clips-helper/lnnmamblgkdjladkhgjecbhgopnfhnih)
[Firefox Store Page](https://addons.mozilla.org/en-US/firefox/addon/twitch-clips-helper/)

Activates on the [https://dashboard.twitch.tv/u/<USERNAME\>/content/clips](https://dashboard.twitch.tv/content/clips) page.

