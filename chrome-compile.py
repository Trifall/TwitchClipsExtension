import os
import shutil

root_src_dir = 'TwitchClipsExtension\\manifests\\'
root_dst_dir = 'TwitchClipsExtension\\'

# Copy the contents of the manifest_chrome.json file from the root_src_dir into the contents of manifest.json in the root_dst_dir
shutil.copy2(root_src_dir + 'manifest_chrome.json', root_dst_dir + 'manifest.json')

# Zip the contents of the TwitchClipsExtension folder into a TwitchClipsExtension.zip file
os.system('7z a -tzip TwitchClipsExtension_Chrome.zip TwitchClipsExtension')

