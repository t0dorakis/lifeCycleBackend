// 'use strict';
const { youngster } = require('./youngsterDialogue')
const analyzeSentiment = require('./sentimentService')
const { saveNewBeing, getAge, saveHeardSentenceOfCurrentCreature } = require('./databaseService')
const { analyzeForCharacter } = require('./characterService')

const createNewLife = async (conv) => {
    return `<speak>
                <!--<audio src="https://firebasestorage.googleapis.com/v0/b/newagent-68b9b.appspot.com/o/babyCry%20(online-audio-converter.com).mp3?alt=media&token=e81d3cc7-5274-4b0f-8ef0-be32391a3d2c">Crying Baby</audio>-->
                <!--<break time="3" />-->
 				 <prosody pitch="+8st">
   					 <emphasis level="low"> Are you my mama? </emphasis>
   					  What is my name?
 				 </prosody>
			</speak>`;
}

const createNewLifeName = async (conv, {name}) => {
    console.log(`new name ${name}`)
    saveNewBeing({name: name, text: conv.query})
    return `<speak>
 				 <prosody pitch="+8st">
   					 <emphasis level="low"> So my new name is ${name} </emphasis>
 				 </prosody>
			</speak>`;
}

const whereAmI = async (conv, {text}) => {
    saveHeardSentenceOfCurrentCreature(text)
    return `<speak>
 				 <prosody pitch="+7st">
   					 <emphasis level="low"> Where am I?</emphasis>
 				 </prosody>
			</speak>`;
}

const whyDoYouLook = async (conv, {text}) => {
    saveHeardSentenceOfCurrentCreature(text)
    return `<speak>
 				 <prosody pitch="+6st">
   					 <emphasis level="low"> Why do you look at me like that?</emphasis>
 				 </prosody>
			</speak>`;
}

const thisIsNotWhatIexpected = async (conv, {text}) => {
    saveHeardSentenceOfCurrentCreature(text)
    return `<speak>
 				 <prosody pitch="+5st">
   					 <emphasis level="low"> This is not what I expected of life. Is it always like that?</emphasis>
 				 </prosody>
			</speak>`;
}

module.exports = {
    createNewLife,
    createNewLifeName,
    whereAmI
}