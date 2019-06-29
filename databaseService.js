const { firestore, firebaseApp } = require('./firebase')
// let admin = {}
// let db = {}
// const setAdminToDatabaseService = newAdmin => {
//     admin = newAdmin
//     db = admin.firestore();
// }

//

const collection = firestore.collection("creature")

const giveName = (payload) => {
// Add a second document with a generated ID.
    firestore.collection("brain").where("uid", "==", payload.uid)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
                doc.update({name: payload})
            });
        })
        .catch((error) => {
            console.error("Error givin new name: ", error);
        });

}

const saveNewBeing = async (payload) => {
// Add a second document with a generated ID.
    console.log('saving name')
    return await collection.add({
        name: payload.name,
        created: firebaseApp.firestore.Timestamp.fromDate(new Date())
    }).then(ref => {
        console.log('Added document with ID: ', ref.id);
        return true
    }).catch((error) => {
        console.error("Error adding creature ", error);
        return error
    });
}

const deleteCreature = async (payload) => {
// Add a second document with a generated ID.
    console.log('saving name')
    const query = collection.where("name", "==", payload.name)
    const batch = firestore.batch()
    return query
        .get()
        .then(async snapshot => {
            snapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });
            return batch.commit();
        })
}


module.exports = {
    saveNewBeing,
    deleteCreature
}