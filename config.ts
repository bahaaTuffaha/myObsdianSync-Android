import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCI1FZOpz2vyu_RD-5iCBy6XcbqCc0hFS8',

  authDomain: 'sync-obsidian-a67f2.firebaseapp.com',

  projectId: 'sync-obsidian-a67f2',

  storageBucket: 'sync-obsidian-a67f2.appspot.com',

  messagingSenderId: '902079444490',

  appId: '1:902079444490:web:5b7ba66d109139261ad1f3',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export {firebase};
