import {zipWithPassword, unzipWithPassword} from 'react-native-zip-archive';
var RNGRP = require('react-native-get-real-path');
import {firebase} from '../config';
import {createTempDirectory} from '../App';
import {generateMyKey} from '../App';
import RNFS, {
  DownloadBeginCallbackResult,
  DownloadProgressCallbackResult,
} from 'react-native-fs';
import {PermissionsAndroid, Platform} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import {Dispatch, SetStateAction} from 'react';

export async function GetAllPermissions() {
  try {
    if (Platform.OS === 'android') {
      const userResponse = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);
      return userResponse;
    }
  } catch (err) {
    console.log(err);
  }
  return null;
}
export async function getFromCloud(
  userPassword: string,
  setUserPassword: Dispatch<SetStateAction<string>>,
  // iv: string,
  // setIv: (value: string | ((prevValue: string) => string)) => void,
  fileLocation: string,
  loading: number,
  setLoading: Dispatch<SetStateAction<number>>,
) {
  setLoading(0);
  await GetAllPermissions();
  // await requestStoragePermission();
  const storageRef = firebase.storage().ref();
  // Check if 'package.enc' exists in Firebase Storage
  const packageRef = storageRef.child('package.enc');

  const tempLocation = await createTempDirectory();
  const downloadPath = tempLocation + '/package.enc';
  try {
    const downloadURL = await packageRef.getDownloadURL();
    // Download the file to the specified local path using RNFS
    const downloadResult = await RNFS.downloadFile({
      fromUrl: downloadURL,
      toFile: downloadPath,
      begin: (res: DownloadBeginCallbackResult) => {
        console.log('Response begin ===\n\n');
        console.log(res);
      },
      progress: (res: DownloadProgressCallbackResult) => {
        //here you can calculate your progress for file download
        let progressPercent = (res.bytesWritten / res.contentLength) * 100; // to calculate in percentage
        setLoading(progressPercent);
      },
    }).promise;

    if (downloadResult.statusCode === 200) {
      console.log('File downloaded successfully to', downloadPath);
    } else {
      console.error('Error downloading file.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
  let gKey = await generateMyKey(userPassword, setUserPassword);
  // console.log('kee:', gKey);
  try {
    await RNFS.unlink(fileLocation + '/syncedNotes');
    console.log(
      `Folder ${
        fileLocation + '/syncedNotes'
      } and its contents have been deleted.`,
    );
  } catch (error) {
    console.error(
      `Error deleting folder ${fileLocation + '/syncedNotes'}:`,
      error,
    );
  }
  await RNFS.mkdir(fileLocation + '/syncedNotes');
  const unzipPath = await unzipWithPassword(
    downloadPath,
    fileLocation + '/syncedNotes',
    gKey,
  );
  RNFS.unlink(downloadPath);
  // await RNFS.moveFile(tempLocation + '/UltraNote', fileLocation);
  setLoading(100);
}
