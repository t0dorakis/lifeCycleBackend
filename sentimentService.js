// natural language ML
// Imports the Google Cloud client library
const language = require('@google-cloud/language');

// Instantiates a client
const projectId = 'lifecycle-a1c95'
const keyFilename = './keys/lifecycle-a1c95-cefa34fa3cf0.json'
const languageClient = new language.LanguageServiceClient({projectId, keyFilename});

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
    return sentiment
}

module.exports = analyzeSentiment