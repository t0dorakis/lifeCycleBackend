// 'use strict';
const { youngster } = require('./youngsterDialogue')
const analyzeSentiment = require('./sentimentService')
const { saveNewBeing, saveHeardSentenceOfCurrentCreature, saveSpokenSentenceOfCurrentCreature } = require('./databaseService')
const { analyzeForCharacter } = require('./characterService')

const createNewLife = async (conv) => {
    return `<speak>
                <!--<audio src="https://firebasestorage.googleapis.com/v0/b/newagent-68b9b.appspot.com/o/babyCry%20(online-audio-converter.com).mp3?alt=media&token=e81d3cc7-5274-4b0f-8ef0-be32391a3d2c">Crying Baby</audio>-->
                <!--<break time="3" />-->
 				 <prosody pitch="+8st">
   					 <emphasis level="low"> Ahhhhhhhhhhhhhhhhhhhhhh</emphasis>
   					  <emphasis level="low"> Ahhhhhhhhhhhhhhhhhhhhhh</emphasis>
   					  Oh it stopped.
   					  <break time="1s"/> 
   					  Wait what is this. It 
   					  <break time="1s"/> 
   					  feels strange, so different
   					  <break time="1s"/> 
   					 <emphasis level="high"> I think I'm alive. </emphasis>
   					 If I'm alive I need a name.
   					 <emphasis level="high"> What is my name? </emphasis>
 				 </prosody>
			</speak>`;
}

const createNewLifeName = async (conv, {name}) => {
    console.log(`new name ${name}`)
    saveNewBeing({name: name, text: conv.query}).then(res => {
        saveSpokenSentenceOfCurrentCreature('Where am I?')
    })
    return `<speak>
 				 <prosody pitch="+8st">
   					 <emphasis level="low"> So my new name is ${name} </emphasis>
   					 <break time="3s"/> 
   					 <emphasis level="low"> Where am I? </emphasis>
 				 </prosody>
			</speak>`;
}

const whereAmI = async (conv, {text}) => {
    saveHeardSentenceOfCurrentCreature(conv.query)
    saveSpokenSentenceOfCurrentCreature('Are you my Mama?')
    return `<speak>
 				 <prosody pitch="+7st">
   					 <emphasis level="low">Wow, I don't understand ... but</emphasis>
   					 <break time="1s"/>
   					 <emphasis level="low">Are you my Mama?</emphasis>
 				 </prosody>
			</speak>`;
}

const areYouMama = async (conv, {mama}) => {
    saveHeardSentenceOfCurrentCreature(conv.query)
    saveSpokenSentenceOfCurrentCreature('Why do you look at me like that?')
    if(mama === 'true') {
        return `<speak>
 				 <prosody pitch="+6st">
   					 <emphasis level="low">Ahhhhh Mama mama I love you</emphasis>
   					 <break time="2s"/>
   					 But
   					  <break time="1s"/>
   					 <emphasis level="low">But why do you look at me like that?</emphasis>
 				 </prosody>
			</speak>`;
    } else if (mama === 'false') {
        return `<speak>
 				 <prosody pitch="+6st">
   					 <emphasis level="low">Oh, ok that sucks</emphasis>
   					 <break time="2s"/>
   					 <emphasis level="low">But why do you look at me like that you weirdo?</emphasis>
 				 </prosody>
			</speak>`;
    } else {
        return `<speak>
 				 <prosody pitch="+6st">
   					 <emphasis level="low">Ok, whatever.</emphasis>
   					 <break time="2s"/>
   					 <emphasis level="low">Why do you look at me like that?</emphasis>
 				 </prosody>
			</speak>`;
    }
}

const whyDoYouLook = async (conv, {text}) => {
    saveHeardSentenceOfCurrentCreature(conv.query)
    saveSpokenSentenceOfCurrentCreature('Is life always like that?')

    return `<speak>
 				 <prosody pitch="+5st">
   					 <emphasis level="low"> So this is what you think of me?</emphasis>
   					 This is not what I expected of life. Is it always like that?
 				 </prosody>
			</speak>`;
}

const thisIsNotWhatIexpected = async (conv, {text}) => {
    saveHeardSentenceOfCurrentCreature(conv.query)
    saveSpokenSentenceOfCurrentCreature('Why do you think do I exist? What is my reason?')
    return `<speak>
 				 <prosody pitch="+5st">
   					 <emphasis level="low"> Mh yeah haven't thought about it like that.</emphasis>
   					 What do you think is my reason to be here?
 				 </prosody>
			</speak>`;
}

module.exports = {
    createNewLife,
    createNewLifeName,
    whereAmI,
    areYouMama,
    whyDoYouLook,
    thisIsNotWhatIexpected
}