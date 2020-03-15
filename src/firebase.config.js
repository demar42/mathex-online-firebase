import * as firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyBE6WCiE6d9Y3aZesN52MOk6s6don3yXXY",
    authDomain: "mathex-online.firebaseapp.com",
    databaseURL: "https://mathex-online.firebaseio.com",
    projectId: "mathex-online",
    storageBucket: "mathex-online.appspot.com",
    messagingSenderId: "439728578925",
    appId: "1:439728578925:web:edc27e2c6bcfdd43fd7a64"
}
firebase.initializeApp(firebaseConfig)

const realtime = firebase.database();
const db = firebase.firestore();

export {db, realtime}