const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { dialogflow } = require('actions-on-google');
const dialogue = require('./dialogue/index')
const databaseService = require('./services/databaseService')
// const GoogleAssistant = require('google-assistant');
const path = require('path');

const secretKey = require('./theo.json')

// natural language ML
// Imports the Google Cloud client library
const language = require('@google-cloud/language');

// api routing
const express = require('express');
const cors = require('cors');
const router = express();


// Instantiates a client
const projectId = 'newagent-68b9b'
const keyFilename = 'theolocal_key_newagent-68b9b.json'
const languageClient = new language.LanguageServiceClient({projectId, keyFilename});

admin.initializeApp(functions.config().firebase);
let db = admin.firestore();

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


const app = dialogflow();

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


router.get('/:id', (req, res) => {
    res.send('hello worls' + req.params.id)
    analyzeSentiment('hillary clinton').catch(console.error);
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
exports.sentiment = functions.https.onRequest(router);

// The text to analyze
// const text = 'Hello, world!';

const analyzeSentiment = async (text) => {
    const document =  {
        content: text,
        type: 'PLAIN_TEXT',
    }
    const [result] = await languageClient.analyzeSentiment({document})
    const sentiment = result.documentSentiment;
    console.log(`Text: ${text}`);
    console.log(`Sentiment score: ${sentiment.score}`);
    console.log(`Sentiment magnitude: ${sentiment.magnitude}`);
}
