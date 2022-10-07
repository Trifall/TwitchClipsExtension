# Twitch Clips Extension

[Chrome Store Page](https://chrome.google.com/webstore/detail/twitch-clips-helper/lnnmamblgkdjladkhgjecbhgopnfhnih)

Activates on the [https://dashboard.twitch.tv/u/<USERNAME\>/content/clips](https://dashboard.twitch.tv/content/clips) page.

## Functionality
- Select the clips that have been made via the checkboxes on the individual clips in the dashboard panel.
- Press the 'Compile Clip Links' button.
  - This automatically compiles the clips and grabs the respective link for each selected one.
  ![Dashboard Example Image](https://i.imgur.com/IA1uLNd.png)
- All of the clip links are then copied to the clipboard after they have been retrieved
  - Will send a chrome notification that displays the result. Warns for clips that have the same title, as those may be problematic for overwriting files, etc.
