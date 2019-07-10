//const functions = require('firebase-functions');
//const admin = require('firebase-admin');
const { functions } = require('./firebase')

const { dialogflow: dialogflowFromActions } = require('actions-on-google');
// const dialogflow = require('dialogflow');
const dialogue = require('./dialogueService')
// const GoogleAssistant = require('google-assistant');
const path = require('path');
const uuid = require('uuid');
const analyzeSentiment = require('./sentimentService')

//admin.initializeApp(functions.config().firebase);

// api routing
const express = require('express');
const cors = require('cors');

const secretKey = require('./keys/lifecycle-a1c95-cefa34fa3cf0.json')

// own imports
const {
    createNewLife,
    createNewLifeName,
    whereAmI,
    areYouMama,
    whyDoYouLook,
    thisIsNotWhatIexpected
} = require('./dialogueService.js');


// const bodyParser = require("body-parser");
const router = express();
router.use(express.json());       // to support JSON-encoded bodies
router.use(express.urlencoded({extended: true})); // to support URL-encoded bodies


// const config = {
//     auth: {
//         keyFilePath: path.resolve('./theo.json'),
//         // where you want the tokens to be saved
//         // will create the directory if not already there
//         savedTokensPath: path.resolve('./tokens.json'),
//     }
// }
// console.dir(config.auth)
// const assistant = new GoogleAssistant(config.auth);

const TEST_INTENT = "start test";
const FEEL_INTENT = 'howDoYouFeel';
const TIME_INTENT = "start time test";

const CREATE_LIFE_INTENT = "createNewLife"
const CREATE_LIFE_NAME_FOLLOWUP = "createNewLifeName"
const WHERE_AM_I_INTENT = "whereAmI";
const ARE_YOU_MY_MAMA_INTENT = "areYouMama";
const WHY_DO_YOU_LOOK = "whyDoYouLook"
const THIS_IS_NOT_WHAT_I_EXPECTED = 'thisIsNotWhatIexpected'
// const agent = new WebhookClient({request, response});
const app = dialogflowFromActions();

const AppContexts = {
    AGE: 'number'
}

app.intent(CREATE_LIFE_INTENT, async (conv, params) => {
    console.log(params)
    conv.ask(await createNewLife(conv));
});
app.intent(CREATE_LIFE_NAME_FOLLOWUP, async (conv, params) => {
    conv.ask(await createNewLifeName(conv, params));
});
app.intent(WHERE_AM_I_INTENT, async (conv, params) => {
    conv.ask(await whereAmI(conv, params));
});
app.intent(ARE_YOU_MY_MAMA_INTENT, async (conv, params) => {
    conv.ask(await areYouMama(conv, params));
});
app.intent(WHY_DO_YOU_LOOK, async (conv, params) => {
    conv.ask(await whyDoYouLook(conv, params));
});
app.intent(THIS_IS_NOT_WHAT_I_EXPECTED, async (conv, params) => {
    conv.ask(await thisIsNotWhatIexpected(conv, params));
});

app.intent(FEEL_INTENT, (conv, params) => {
    analyzeSentiment(conv.query)
    // giveName('kiddo')
    // dialogue.feel()
    conv.ask(`<speak>
 				 <prosody rate="fast" pitch="+8st">
   					 I hurt my ankle, can you kiss my ancle? Please daddy!<emphasis level="moderate"> Please! </emphasis>
 				 </prosody>
			</speak>`);
});

app.intent(TEST_INTENT, (conv) => {
    conv.ask(`<speak>
 				 <prosody rate="slow" pitch="-8st">
   					 You go ahead, I’m just going to sit for a minute.
 				 </prosody>
			</speak>`);
});

app.intent(TIME_INTENT, (conv) => {
    const localTime = Date.now();
conv.ask(`starting the test with time ${localTime}`);
});

router.get('/test', async (req, res) => {
    // const test = await runSample();
    res.send(test)
})

router.post('/sentimentAnalysis', async (req, res, next) => {
    // console.log('req.text', req.text)
    // console.log('req.body', req.body)
    // console.log('req', req)
    const text = req.body
    // console.log(text)
    const sentiment = await analyzeSentiment(text).catch(console.error)
    res.send(sentiment)
    res.status(500).send('Something broke!')
    })

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
exports.api = functions.https.onRequest(router);
exports._middleware = functions.https.onRequest(app);
// The text to analyze
// const text = 'Hello, world!';