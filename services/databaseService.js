const functions = require('firebase-functions');
const admin = require('firebase-admin');

// admin.initializeApp(functions.config().firebase);

// let db = admin.firestore();

// const giveName = (payload) => {
// // Add a second document with a generated ID.
//     db.collection("brain").where("uid", "==", payload.uid)
//         .get()
//         .then(querySnapshot => {
//             querySnapshot.forEach(function(doc) {
//                 console.log(doc.id, " => ", doc.data());
//                 doc.update({name: payload})
//             });
//         })
//         .catch((error) => {
//             console.error("Error givin new name: ", error);
//         });
//
// }