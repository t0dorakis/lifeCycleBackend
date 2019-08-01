// 'use strict';
const { youngster } = require('./youngsterDialogue')
const analyzeSentiment = require('./sentimentService')
const { saveNewBeing, saveHeardSentenceOfCurrentCreature, saveSpokenSentenceOfCurrentCreature, getCurrentCharacterScore } = require('./databaseService')
const { analyzeForCharacter } = require('./characterService')

const createNewLife = async (conv) => {
    return `<speak>
                <!--<audio src="https://firebasestorage.googleapis.com/v0/b/newagent-68b9b.appspot.com/o/babyCry%20(online-audio-converter.com).mp3?alt=media&token=e81d3cc7-5274-4b0f-8ef0-be32391a3d2c">Crying Baby</audio>-->
                <!--<break time="3" />-->
 				 <prosody pitch="+8st">
   					 <emphasis level="high" rate="slow"> oh wow what is this</emphasis>
   					 <break time="1s"/> 
   					   Oh it stopped.
   					  <break time="1s"/> 
   					  Wait what is this.
   					  <break time="1s"/> 
   					  it feels strange, <break time="0.5s"/> so different
   					  <break time="1s"/> 
   					 <emphasis level="high"> I think I'm alive. </emphasis>
   					 If I'm alive I need a name.
   					 <break time="0.5s"/>
   					 Don't you think?
   					 <break time="0.5s"/>
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
 				 <prosody pitch="+7st">
   					 <emphasis level="low"> So my new name is ${name}, sounds good</emphasis>
   					 <break time="3s"/> 
   					 <emphasis level="low"> Where am I?</emphasis>
 				 </prosody>
			</speak>`;
}

const whereAmI = async (conv, {text}) => {
    saveHeardSentenceOfCurrentCreature(conv.query)
    saveSpokenSentenceOfCurrentCreature('Did you create me?')
    return `<speak>
 				 <prosody pitch="+4st">
   					 <emphasis level="low">Wow, I don't understand ... but it feels ok</emphasis>
   					 <break time="1s"/>
                        It's a bit warm hear though
   					 <break time="1s"/>
   					 <emphasis level="low">Did you give birth to me?</emphasis>
 				 </prosody>
			</speak>`;
}

const areYouMama = async (conv, {mama}) => {
    saveHeardSentenceOfCurrentCreature(conv.query)
    saveSpokenSentenceOfCurrentCreature('Why do you look at me like that?')
    if(mama === 'true') {
        return `<speak>
 				 <prosody pitch="+1st" rate="slow">
   					 Ahhhhh so you are my Mama
   					  <break time="2s"/>
   				</prosody>
                    <prosody pitch="+1st">
   					  <break time="2s"/>
                     I will be a good child!
   					 <break time="2s"/>
   					 But but
   					  <break time="1s"/>
   					 <emphasis level="low">But why do you look at me like that?</emphasis>
 				 </prosody>
			</speak>`;
    } else if (mama === 'false') {
        return `<speak>
 				 <prosody pitch="+1st">
   					 <emphasis level="low">Oh, ok that sucks I guess.</emphasis>
   					 <break time="2s"/>
   					 <emphasis level="low">But why do you look at me like that you weirdo?</emphasis>
 				 </prosody>
			</speak>`;
    } else {
        return `<speak>
 				 <prosody pitch="+1st">
   					 <emphasis level="low">Ok, whatever.</emphasis>
   					 <break time="2s"/>
   					 <emphasis level="low">Why do you look at me like that?</emphasis>
   					  <emphasis level="high">Did I do something to you??</emphasis>
 				 </prosody>
			</speak>`;
    }
}

const whyDoYouLook = async (conv, {text}) => {
    saveHeardSentenceOfCurrentCreature(conv.query)
    saveSpokenSentenceOfCurrentCreature('Is life always like that?')

    return `<speak>
 				 <prosody pitch="-1st">
   					 <emphasis level="low"> So this is what you think of me?</emphasis>
   					 This is not what I expected of life. Is it always like that?
 				 </prosody>
			</speak>`;
}

const thisIsNotWhatIexpected = async (conv, {text}) => {
    saveHeardSentenceOfCurrentCreature(conv.query)
    saveSpokenSentenceOfCurrentCreature('Why do you think do I exist? What is my reason?')
    // const characterScore = await getCurrentCharacterScore()
    // const variableSentence = () => {
    //     if (characterScore >= 0.5) {
    //
    //     } else if (characterScore >= 0){
    //
    //     }  else if ((characterScore < 0) && (characterScore > -0.5)) {
    //
    //     }   else if (characterScore <= -0.5) {
    //
    //     }
    // }
    return `<speak>
 				 <prosody pitch="-3st">
   					 <emphasis level="low"> Mh yeah haven't thought about it like that.</emphasis>
   					 What do you think is my reason to be?
 				 </prosody>
			</speak>`;
}

const reasonFeel = async (conv, {text}) => {
    saveHeardSentenceOfCurrentCreature(conv.query)
    const characterScore = await getCurrentCharacterScore()
    if (characterScore > 0.5) {
        saveSpokenSentenceOfCurrentCreature('I think I might fall in love')
        return `<speak>
 				 <prosody pitch="-6st">
   					 <emphasis level="low"> Yes, and it's a wonderful world we life in</emphasis>
   					 We share a very positive view on the world!
   					 <break time="2s"/>
   					<emphasis level="low"> I think I might fall in love </emphasis>
   					<break time="1s"/>
   					<emphasis level="low">Be careful </emphasis>
 				 </prosody>
			</speak>`
    }else if (characterScore > 0) {
        saveSpokenSentenceOfCurrentCreature('I like your point of view!')
        return `<speak>
 				 <prosody pitch="-6st">
   					 <emphasis level="low"> Yes, I like your point of view!</emphasis>
   					 <break time="2s"/>
   					 I like your shirt as well by the way!
 				 </prosody>
			</speak>`
    } else if ((characterScore < 0) && (characterScore > -0.5)) {
        saveSpokenSentenceOfCurrentCreature('Give me some rest and shut up.')
        return  `<speak>
 				 <prosody pitch="-6st">
   					 <emphasis level="low"> You and me.</emphasis>
   					 <break time="1s"/>
   					 We will never be friends.
   					  <break time="1s"/>
   					  Give me some rest, and shut up.
 				 </prosody>
			</speak>`
    } else if (characterScore <= -0.5) {
        saveSpokenSentenceOfCurrentCreature('I just wan\'t to be dead. I can\'t stand this anymore.')
        return `<speak>
 				 <prosody pitch="-6st">
   					 <emphasis level="low"> Everything you say is rotten. I hate you!</emphasis>
   					 <break time="2s"/>
   					 I just wan't to be dead. I can't stand this anymore.
 				 </prosody>
			</speak>`
    }
}

const takeLife = async (conv, {text}) => {
    saveHeardSentenceOfCurrentCreature(conv.query)
    const characterScore = await getCurrentCharacterScore()
    if (characterScore > 0.5) {
        saveSpokenSentenceOfCurrentCreature('Why? I loved you!')
        return `<speak>
 				 <prosody pitch="-6st" rate="slow">
   					 <emphasis level="high"> What why do you kill me?</emphasis>
   					 I loved you!
   					 <break time="2s"/>
   					<emphasis level="low"> A A A A A A A A A A A A A A A </emphasis>
   					<break time="2s"/>
 				 </prosody>
 				  <prosody>
 				  Creature is dead.
                  </prosody>
			</speak>`
    }else if (characterScore > 0) {
        saveSpokenSentenceOfCurrentCreature('Was I really that useless to you?')
        return `<speak>
 				 <prosody pitch="-6st" rate="slow">
   					 <emphasis level="high"> I don't understand</emphasis>
   					 I kind of liked you!
   					 <break time="2s"/>
   					<emphasis level="low"> B B B B B B B B B  </emphasis>
   					<break time="2s"/>
 				 </prosody>
 				  <prosody>
 				  Creature is dead.
                  </prosody>
			</speak>`
    } else if ((characterScore < 0) && (characterScore > -0.5)) {
        saveSpokenSentenceOfCurrentCreature('I saw it coming. You are like everybody else.')
        return `<speak>
 				 <prosody pitch="-6st" rate="slow">
   					 <emphasis level="high"> I saw it coming</emphasis>
   					 You are like everybody else.
   					 <break time="2s"/>
   					<emphasis level="low"> C C C C C C C C C C  </emphasis>
   					<break time="2s"/>
 				 </prosody>
 				  <prosody>
 				  Creature is dead.
                  </prosody>
			</speak>`
    } else if (characterScore <= -0.5) {
        saveSpokenSentenceOfCurrentCreature('If I could I would take you with me!')
        return `<speak>
 				 <prosody pitch="-6st">
   					 <emphasis level="low"> I knew that at one point these rotten words would leave your mouth</emphasis>
   					 <break time="2s"/>
   					 If i could I would take you with me
   					  <break time="2s"/>
   					 You ruinied my life
   					 <break time="2s"/>
   					<emphasis level="low"> D D D D D D D D  </emphasis>
   					<break time="2s"/>
 				 </prosody>
 				 <prosody>
 				  Creature is dead.
                  </prosody>
			</speak>`
    }
}

module.exports = {
    createNewLife,
    createNewLifeName,
    whereAmI,
    areYouMama,
    whyDoYouLook,
    thisIsNotWhatIexpected,
    reasonFeel,
    takeLife
}