const { firestore, firebaseApp } = require('./firebase')
const analyzeSentiment = require('./sentimentService')

const creature = firestore.collection("creature")
const state = firestore.collection("state")
const heardSentences = firestore.collection('heardSentences')

const setIdToState = async (id) => {
    return await state.doc('currentCreature').update({id: id}).then(ref => {
        console.log('State changed to follow creature with id', id);
        return true
    }).catch((error) => {
        console.error(`Error setting state to follow creature with id ${id}`, error);
        return error
    });
}

const getCurrentCreatureId = async () => {
    return await state.doc('currentCreature').get()
        .then(doc => {
            console.log(`Success in getCurrentCreatureId = `, doc.data().id);
            return doc.data().id
        })
        .catch(error => {
            console.error(`Error in getCurrentCreatureId`, error);
            return error
        })
}

const incrementAgeOfCurrentCreature = async () => {
    const doc = await getCurrentCreature()
    return incrementAge(doc)
}

const incrementAge = async (doc) => {
    return doc.update({
        age: firebaseApp.firestore.FieldValue.increment(1)
    }).then(ref => {
        console.log('success in incrementingAge')
        return true
    }).catch((error) => {
        console.error(`Error in incrementingAge of doc: ${doc}`, error);
        return error
    });
}


const getCurrentCreature = async () => {
    const id = await getCurrentCreatureId()
    return await getCreatureById(id)
}

const getCreatureById = async (id) => {
    return creature.doc(id)
    // return await creature.doc(id).then(doc => {
    //     console.log(`Found creature with ${id}`);
    //     return doc
    // }).catch((error) => {
    //     console.error(`could not find creature with ${id}`, error);
    //     return error
    // });
}

const getAgeOfCreature = async (id) => {
    const doc = await getCreatureById(id)
    return doc.get()
        .then( doc => {
            console.log('success in getAgeOfCreature for id ', id, doc.data().age)
            return doc.data().age
        })
        .catch(error => {
            console.log('Error in getAgeOfCreature for id ', id)
            return error
        })
}

const saveHeardSentence = async (payload) => {
    const sentiment = await analyzeSentiment(payload.text)
    const age = await getAgeOfCreature(payload.id)
    const row = {
        [age]: {
            creatue_id: payload.id,
            creature_age: age,
            text: payload.text,
            sentiment: sentiment
        }
    }
    // const doc = await getCurrentCreature(payload.id)
    return heardSentences.doc(payload.id).set(row, { merge: true }).then(ref => {
        console.log('success in saving heard sentence')
        return true
    }).catch((error) => {
        console.error(`Error in saving  heard sentence for age of ${payload.age} and creature id: ${payload.id}`, error);
        return error
    });
}

const getHeardSentences = async (creatureId) => {
    return heardSentences.doc(creatureId).get().then(doc => {
        console.log(`success in getting heard sentences of creature ${creatureId}`)
        return doc.data()
    }).catch((error) => {
        console.error(`Error in getting heard sentences of creature ${creatureId}`, error);
        return error
    });
}

const getCreatureCharacterScore = async (creatureId) => {
    const heardSentencesObject = await getHeardSentences(creatureId)
    const sentencesArray = Object.values(heardSentencesObject)
    const averageCharacterScore = sentencesArray.reduce((p, c) => p + c.sentiment.score, 0) / sentencesArray.length
    return averageCharacterScore
}

const updateCurrentCreatureCharacter = async () => {
    const currentCreature = await getCurrentCreature()
    const characterScore = await getCreatureCharacterScore(currentCreature.id)
    return currentCreature.update({character: characterScore})
        .then(
        ref => {
            console.log(`Success in updateCreatureChracter for creatureID: ${currentCreature.id} and a score of ${characterScore}`)
            return true
        }
    ).catch(error => {
        console.error(`Error in updateCreatureChracter of creature ${currentCreature.id}`, error);
        return error
    })
}

const saveNewBeing = async (payload) => {
    const initialCreature = {
        name: payload.name,
        age: 0,
        character: 0.5,
        created: firebaseApp.firestore.Timestamp.fromDate(new Date())
    }
    return await creature.add(initialCreature).then(ref => {
        console.log('Added creature with ID: ', ref.id);
        const saved = saveHeardSentence({id: ref.id, text: payload.text}).catch(error => error)
        const setId = setIdToState(ref.id).catch(error => error)
        return saved && setId
    }).catch((error) => {
        console.error("Error adding creature ", error);
        return error
    });
}

const deleteCreature = async (payload) => {
// Add a second document with a generated ID.
    const query = creature.where("name", "==", payload.name)
    const batch = firestore.batch()
    return query
        .get()
        .then(async snapshot => {
            snapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });
            console.log('deleted all creatures with name: ', payload.name)
            return batch.commit();
        })
}


module.exports = {
    saveNewBeing,
    deleteCreature,
    getAgeOfCreature,
    incrementAgeOfCurrentCreature,
    saveHeardSentence,
    getCreatureCharacterScore,
    updateCurrentCreatureCharacter,
    setIdToState,
    getCurrentCreatureId
}