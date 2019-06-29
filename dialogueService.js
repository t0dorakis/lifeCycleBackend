// 'use strict';
const { youngster } = require('./youngsterDialogue')
const analyzeSentiment = require('./sentimentService')
const { saveNewBeing } = require('./databaseService')

const feel = () => {
        console.log('hello')
}
const createNewLife = async (conv) => {
    const sentiment = await analyzeSentiment(conv.query)
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
    const sentiment = await analyzeSentiment(conv.query)
    console.log(`new name ${name}`)
    saveNewBeing({name, sentiment})
    return `<speak>
 				 <prosody pitch="+8st">
   					 <emphasis level="low"> So my new name is ${name} </emphasis>
 				 </prosody>
			</speak>`;
}

module.exports = {
    createNewLife,
    createNewLifeName
}