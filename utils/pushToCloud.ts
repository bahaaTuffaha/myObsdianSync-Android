import {zipWithPassword, unzipWithPassword} from 'react-native-zip-archive';
var RNGRP = require('react-native-get-real-path');
import {firebase} from '../config';
import {createTempDirectory} from '../App';
import {generateMyKey} from '../App';
import RNFS from 'react-native-fs';
import {Dispatch, SetStateAction} from 'react';

export async function pushToCloud(
  userPassword: string,
  setUserPassword: Dispatch<SetStateAction<string>>,
  // iv: string,
  // setIv: (value: string | ((prevValue: string) => string)) => void,
  fileLocation: string,
  loading: number,
  setLoading: Dispatch<SetStateAction<number>>,
) {
  setLoading(0);
  try {
    let gKey = await generateMyKey(userPassword, setUserPassword);
    const tempLocation = await createTempDirectory();
    const encryptionType = 'AES-256';

    const zipPath = await zipWithPassword(
      fileLocation,
      tempLocation + '/package.enc',
      gKey,
      encryptionType as any,
    );

    console.log(`Zip with encryption completed at ${zipPath}`);

    // Use Firebase Storage reference to upload the file
    const storageRef = firebase.storage().ref().child('package.enc'); // Replace with desired storage location
    const fileData = (await RNFS.readFile(zipPath, 'base64')) as any;
    const uploadTask = storageRef.put(fileData, {
      contentType: 'application/zip',
    });
    // Handle the upload progress if needed
    uploadTask.on('state_changed', snapshot => {
      // You can track the upload progress here if needed
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setLoading(progress);
    });
    await uploadTask;

    console.log('File uploaded successfully.');
    // Clean up temporary files if needed
    await RNFS.unlink(zipPath);
  } catch (error) {
    console.error('Error:', error);
  }
  setLoading(100);
}
