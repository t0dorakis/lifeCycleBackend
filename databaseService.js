const { firestore, firebaseApp } = require('./firebase')
const analyzeSentiment = require('./sentimentService')

const creature = firestore.collection("creature")
const state = firestore.collection("state")
const heardSentences = firestore.collection('heardSentences')
const spokenSentences = firestore.collection('spokenSentences')

const setIdToState = async (id) => {
    return await state.doc('currentCreature').update({id: id}).then(ref => {
        console.log('State changed to follow creature with id', id);
        return true
    }).catch((error) => {
        console.error(`Error setting state to follow creature with id ${id}`, error);
        return error
    });
}

const setStateAge = async (age) => {
    return await state.doc('currentCreature').update({age: age}).then(ref => {
        console.log('Success in setNewBornToState');
        return true
    }).catch((error) => {
        console.error(`Error in setNewBornToState`, error);
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


const getCurrentCreature = async () => {
    const id = await getCurrentCreatureId()
    return await getCreatureById(id)
}

const getCreatureById = async (id) => {
    return creature.doc(id)
}

const incrementAgeOfCurrentCreature = async () => {
    const doc = await getCurrentCreature()
    return incrementAge(doc)
}

const incrementAge = async (doc) => {
    return doc.update({
        age: firebaseApp.firestore.FieldValue.increment(1)
    }).then(async ref => {
        console.log('success in incrementingAge', ref)
        const again = await doc.get().then(doc => doc.data().age)
        return await setStateAge(again)
    }).catch((error) => {
        console.error(`Error in incrementingAge of doc: ${doc}`, error);
        return error
    });
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

const saveHeardSentenceOfCurrentCreature = async (text) => {
    const doc = await getCurrentCreature()
    const creature = await doc.get().then(res => res.data())
    const id = doc.id
    const age = creature.age
    const sentiment = await analyzeSentiment(text)
    updateCurrentCreatureCharacter()

    const row = {
        [age]: {
            creatue_id: id,
            creature_age: age,
            text: text,
            sentiment: sentiment
        }
    }
    return heardSentences.doc(id).set(row, { merge: true }).then(ref => {
        console.log('success in saving heard sentence')
        return incrementAge(doc).then(res => true).catch(error => error)
    }).catch((error) => {
        console.error(`Error in saving  heard sentence for age of ${age} and creature id: ${id}`, error);
        return error
    });
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
    return heardSentences.doc(payload.id).set(row, { merge: true }).then(ref => {
        console.log('success in saving heard sentence')
        return incrementAgeOfCurrentCreature().then(res => true).catch(error => error)
    }).catch((error) => {
        console.error(`Error in saving  heard sentence for age of ${payload.age} and creature id: ${payload.id}`, error);
        return error
    });
}
const saveSpokenSentence = async (payload) => {
    const row = {
        sentences: firebaseApp.firestore.FieldValue.arrayUnion(payload.text)
    }
    return spokenSentences.doc(payload.id).set(row, { merge: true }).then(ref => {
        console.log('success in saving spoken sentence', payload.text)
        return true
    }).catch((error) => {
        console.error(`Error in saving spoken sentence of ${payload.id}: ${payload.text}`, error);
        return error
    });
}

const saveSpokenSentenceOfCurrentCreature = async (text) => {
    const id = await getCurrentCreatureId()
    return await saveSpokenSentence({id, text})
}

const getHeardSentences = async (creatureId) => {
    return await heardSentences.doc(creatureId).get().then(doc => {
        console.log(`success in getting heard sentences of creature ${creatureId}`)
        return doc.data()
    }).catch((error) => {
        console.error(`Error in getting heard sentences of creature ${creatureId}`, error);
        return error
    });
}

const getLastSpokenSentence = async (creatureId) => {
    const spoken =  await spokenSentences.doc(creatureId).get().then(doc => {
        console.log(`success in getting spoken sentences of creature ${creatureId}`)
        return doc.data()
    }).catch(error => error)
    return spoken.sentences[spoken.sentences.length - 1]
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
        age: 1,
        character: 0.5,
        created: firebaseApp.firestore.Timestamp.fromDate(new Date())
    }
    return await creature.add(initialCreature).then(ref => {
        console.log(`Added creature with ID: ${ref.id} and name: ${payload.name} `);
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
    saveHeardSentenceOfCurrentCreature,
    getCreatureCharacterScore,
    updateCurrentCreatureCharacter,
    setIdToState,
    getCurrentCreatureId,
    saveSpokenSentence,
    saveSpokenSentenceOfCurrentCreature,
    getLastSpokenSentence,
    setStateAge
}