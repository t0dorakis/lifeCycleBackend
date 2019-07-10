const request = require('supertest');
const myFunctions = require('../index.js');
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));
// make sure our app can handle json
app.use(bodyParser.json());
// Usually, our webhook only export dialogFlowFulfillment.
// This time, we need to export our dialogflow app instance
// from our webhook as _middleware.
// eg: exports._middleware = app;
app.use(myFunctions._middleware);
const test = require("ava");
// Use the "try it" feature on dialogflow feature.
// Check diagnostic information, and grab the fulfillment request
const payload = {
    "responseId": "bd3a4215-238a-45c8-a7f8-fb38886b48ed-68e175c7",
    "queryResult": {
        "queryText": "create life",
        "parameters": {
        },
        "allRequiredParamsPresent": true,
        "fulfillmentMessages": [
            {
                "text": {
                    "text": [
                        ""
                    ]
                }
            }
        ],
        "outputContexts": [
            {
                "name": "projects/lifecycle-a1c95/agent/sessions/437c3a52-bf0a-18a2-a9ab-6789debfc211/contexts/createnewlife-followup",
                "lifespanCount": 2,
                "parameters": {
                }
            }
        ],
        "intent": {
            "name": "projects/lifecycle-a1c95/agent/intents/070578e2-79c7-4877-b75d-92b1647f5ec3",
            "displayName": "createNewLife"
        },
        "intentDetectionConfidence": 1,
        "languageCode": "en"
    },
    "originalDetectIntentRequest": {
        "payload": {}
    },
    "session": "projects/lifecycle-a1c95/agent/sessions/437c3a52-bf0a-18a2-a9ab-6789debfc211"
}

const payloadFollowUp = {
    "responseId": "a7fb6a6e-9227-456b-8441-0a7858ddcb8d-13076db6",
    "queryResult": {
        "queryText": "your name is Jack",
        "parameters": {
            "name": ""
        },
        "allRequiredParamsPresent": true,
        "fulfillmentMessages": [
            {
                "text": {
                    "text": [
                        ""
                    ]
                }
            }
        ],
        "outputContexts": [
            {
                "name": "projects/newagent-68b9b/agent/sessions/a4fb90e6-5979-1331-e0e0-c147b98f73d5/contexts/createnewlife-followup",
                "lifespanCount": 2,
                "parameters": {
                    "name": "",
                    "name.original": ""
                }
            }
        ],
        "intent": {
            "name": "projects/newagent-68b9b/agent/intents/8a3271fe-4f05-4af0-8cf4-45e75f4bfd0e",
            "displayName": "createNewLifeName"
        },
        "intentDetectionConfidence": 1,
        "languageCode": "en"
    },
    "originalDetectIntentRequest": {
        "payload": {}
    },
    "session": "projects/newagent-68b9b/agent/sessions/a4fb90e6-5979-1331-e0e0-c147b98f73d5"
}

const age1 = {
    "responseId": "bd3a4215-238a-45c8-a7f8-fb38886b48ed-68e175c7",
    "queryResult": {
        "queryText": "create life",
        "parameters": {
        },
        "allRequiredParamsPresent": true,
        "fulfillmentMessages": [
            {
                "text": {
                    "text": [
                        ""
                    ]
                }
            }
        ],
        "outputContexts": [
            {
                "name": "projects/lifecycle-a1c95/agent/sessions/437c3a52-bf0a-18a2-a9ab-6789debfc211/contexts/createnewlife-followup",
                "lifespanCount": 2,
                "parameters": {
                }
            }
        ],
        "intent": {
            "name": "projects/lifecycle-a1c95/agent/intents/070578e2-79c7-4877-b75d-92b1647f5ec3",
            "displayName": "createNewLife"
        },
        "intentDetectionConfidence": 1,
        "languageCode": "en"
    },
    "originalDetectIntentRequest": {
        "payload": {}
    },
    "session": "projects/lifecycle-a1c95/agent/sessions/437c3a52-bf0a-18a2-a9ab-6789debfc211"
}

const whereAmI = {
    "responseId": "a7fb6a6e-9227-456b-8441-0a7858ddcb8d-13076db6",
    "queryResult": {
        "queryText": "You are at fhp. Whatever that means.",
        "parameters": {
            "test": "You are at fhp. Whatever that means."
        },
        "allRequiredParamsPresent": true,
        "fulfillmentMessages": [
            {
                "text": {
                    "text": [
                        ""
                    ]
                }
            }
        ],
        "outputContexts": [
            {
                "name": "projects/newagent-68b9b/agent/sessions/a4fb90e6-5979-1331-e0e0-c147b98f73d5/contexts/createnewlife-followup",
                "lifespanCount": 2,
                "parameters": {
                    "name": "",
                    "name.original": ""
                }
            }
        ],
        "intent": {
            "name": "projects/lifecycle-a1c95/agent/intents/070578e2-79c7-4877-b75d-92b1647f5ec3",
            "displayName": "createNewLifeName"
        },
        "intentDetectionConfidence": 1,
        "languageCode": "en"
    },
    "originalDetectIntentRequest": {
        "payload": {}
    },
    "session": "projects/newagent-68b9b/agent/sessions/a4fb90e6-5979-1331-e0e0-c147b98f73d5"
}

test("newLife", async t => {
    t.plan(1)
    await request(app)
        .post('/')
        .send(payload)
        .accept('json')
        .then((response) => {
            t.is(response.status, 200);
        });
});

test("newLife Follow up with name", async t => {
    t.plan(1)
    await request(app)
        .post('/')
        .send(payloadFollowUp)
        .accept('json')
        .then((response) => {
            t.is(response.status, 200);
        });
});
//
// test("whereAmI", async t => {
//     t.plan(1)
//     await request(app)
//         .post('/')
//         .send(whereAmI)
//         .accept('json')
//         .then((response) => {
//             t.is(response.status, 200);
//         });
// });

// test("Age1", async t => {
//     t.plan(1)
//     await request(app)
//         .post('/')
//         .send(age1)
//         .accept('json')
//         .then((response) => {
//             t.is(response.status, 200);
//         });
// });