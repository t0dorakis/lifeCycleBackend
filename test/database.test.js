const {
    setIdToState,
    saveNewBeing,
    deleteCreature,
    getAgeOfCreature,
    saveHeardSentence,
    getCreatureCharacterScore,
    incrementAgeOfCurrentCreature,
    updateCurrentCreatureCharacter,
    getCurrentCreatureId
} = require('../databaseService')

const test = require("ava");
// Use the "try it" feature on dialogflow feature.
// Check diagnostic information, and grab the fulfillment request

const payload = {name: 'Jack', text: 'what a world!'}
const heardSentence = {id: 'test', text: 'this is a tasty test text'}

test("saving heard sentence", async t => {
    t.plan(1)
    const call = await saveHeardSentence(heardSentence)
    t.is(call, true);
});

test.serial("setting currentCreature ID in state", async t => {
    t.plan(1)
    const call = await setIdToState(heardSentence.id)
    t.is(call, true);
});

test("getCurrentCreatureId", async t => {
    t.plan(1)
    const call = await getCurrentCreatureId()
    t.is(typeof call, 'string');
});

test("getting average character score", async t => {
    t.plan(1)
    const call = await getCreatureCharacterScore(heardSentence.id)
    console.log('avarage score is', call)
    t.is(typeof call, 'number');
});

test("getAgeOfCreature", async t => {
    t.plan(1)
    const call = await getAgeOfCreature(heardSentence.id)
    t.is(typeof call, 'number');
});

test("incrementAgeOfCurrentCreature", async t => {
    t.plan(1)
    const call = await incrementAgeOfCurrentCreature()
    t.is(call, true);
});

test("updateCurrentCreatureCharacter", async t => {
    t.plan(1)
    const first = await setIdToState(heardSentence.id)
    const call = await updateCurrentCreatureCharacter()
    t.is(call, true);
});

test("adding new document into creature", async t => {
    t.plan(1)
    const call = await saveNewBeing(payload)
    t.is(call, true);
});
//
// test("deleting test creature", async t => {
//     t.plan(1)
//     const call = await deleteCreature(payload)
//     t.is(Object.keys(call[0])[0], '_writeTime');
// });
//
// test("deleting other test creature", async t => {
//     t.plan(1)
//     const call = await deleteCreature({name: 'Jack'})
//     t.is(Object.keys(call[0])[0], '_writeTime');
// });

