import os
import shutil
import pathlib

path = pathlib.Path(__file__).parent.resolve()

root_src_dir = str(path) + '/TwitchClipsExtension/manifests/'
root_dst_dir = str(path) + '/TwitchClipsExtension/'

# Copy the contents of the manifest_firefox.json file from the root_src_dir into the contents of manifest.json in the root_dst_dir
shutil.copy2(root_src_dir + 'manifest_firefox.json',
             root_dst_dir + 'manifest.json')

# Zip the contents of the TwitchClipsExtension folder into a TwitchClipsExtension.zip file
os.system('7z a -tzip TwitchClipsExtension_Firefox.zip TwitchClipsExtension')
