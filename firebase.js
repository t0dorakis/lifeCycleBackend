const functions = require('firebase-functions');
const firebaseApp = require('firebase-admin');

// let serviceAccount = require('./serviceAccountKey.json')
firebaseApp.initializeApp({
    credential: firebaseApp.credential.applicationDefault(),
});

module.exports.firebaseApp = firebaseApp
module.exports.firestore = firebaseApp.firestore()
module.exports.functions = functions
