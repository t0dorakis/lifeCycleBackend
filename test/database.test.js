const {
    setIdToState,
    saveNewBeing,
    deleteCreature,
    getAgeOfCreature,
    saveHeardSentence,
    getCreatureCharacterScore,
    incrementAgeOfCurrentCreature,
    updateCurrentCreatureCharacter,
    getCurrentCreatureId,
    saveSpokenSentence,
    getLastSpokenSentence,
    setStateAge,
    saveHeardSentenceOfCurrentCreature,
    saveSpokenSentenceOfCurrentCreature,
    saveSpokenSentenceToState,
    saveHeardSentenceToState,
    setCreatureAliveInState,
    killCreature
} = require('../databaseService')

const test = require("ava");
// Use the "try it" feature on dialogflow feature.
// Check diagnostic information, and grab the fulfillment request

const payload = {name: 'Jack', text: 'what a world!'}
const heardSentence = {id: 'test', text: 'this is a tasty test text'}
const spokenSentence = {id: 'name', text: 'this is another tasty test text'}
const justText = 'My life as a test message sux'
const heardObject = {text: 'a test message sux', sentiment: {score: 0.5, magnitude: 0.5}}

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
test("saveHeardSentenceToState", async t => {
    t.plan(1)
    const call = await saveHeardSentenceToState(heardObject)
    t.is(call, true);
});
test("saveSpokenSentenceToState", async t => {
    t.plan(1)
    const call = await saveSpokenSentenceToState(justText)
    t.is(call, true);
});
test("killCreature", async t => {
    t.plan(1)
    const call = await killCreature()
    t.is(call, true);
});
test("setCreatureAliveInState", async t => {
    t.plan(1)
    const call = await setCreatureAliveInState()
    t.is(call, true);
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

test("setStateAge", async t => {
    t.plan(1)
    const call = await setStateAge(0)
    t.is(call, true);
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

test("saving heard sentence", async t => {
    t.plan(1)
    const call = await saveHeardSentence(heardSentence)
    t.is(call, true);
});

test("saving spoken sentence", async t => {
    t.plan(1)
    const call = await saveSpokenSentence(spokenSentence)
    t.is(call, true);
});

test("getLastSpokenSentence", async t => {
    t.plan(1)
    const call = await getLastSpokenSentence(spokenSentence.id)
    t.is(call, spokenSentence.text);
});

test('saveHeardSentenceOfCurrentCreature', async t => {
    t.plan(1)
    const call = await saveHeardSentenceOfCurrentCreature(justText)
    t.is(call, true);
})

test('saveSpokenSentenceOfCurrentCreature', async t => {
    t.plan(1)
    const call = await saveSpokenSentenceOfCurrentCreature(justText)
    t.is(call, true);
})

test("deleting test creature", async t => {
    t.plan(1)
    const call = await deleteCreature(payload)
    t.is(Object.keys(call[0])[0], '_writeTime');
});

test("deleting other test creature", async t => {
    t.plan(1)
    const call = await deleteCreature({name: 'Jack'})
    t.is(Object.keys(call[0])[0], '_writeTime');
});

