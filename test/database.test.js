const { saveNewBeing, deleteCreature } = require('../databaseService')

const test = require("ava");
// Use the "try it" feature on dialogflow feature.
// Check diagnostic information, and grab the fulfillment request

const payload = {name: 'test'}

test("adding new document into creature", async t => {
    t.plan(1)
    const call = await saveNewBeing(payload)
    t.is(call, true);
});

test("deleting test creature", async t => {
    t.plan(1)
    const call = await deleteCreature(payload)
    t.is(Object.keys(call[0])[0], '_writeTime');
});
