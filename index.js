const rand = require('bmjs-random');
const person = require('bmjs-engperson');
const verb = require('bmjs-engverb');
const pronoun = require('bmjs-engpronouns');
const fs = require('fs');
const http = require('http');

module.exports = {
  currentSentence: '',
  currentParagraph: '',
  currentParagraphArray: [],
  tagsToPrint: {},
  source: '',
  init: function() {
    this.currentSentence = '';
    this.currentParagraph = '';
    this.currentParagraphArray = [];
    this.tagsToPrint = {};
    return this;
  },
  start: function() {
    this.currentSentence = '';
    return this;
  },
  add: function() {
    if (this.currentSentence) {
      this.currentParagraph += this.currentSentence;
      this.currentParagraphArray.push(this.currentSentence.trim());
    }
    return this;
  },
  stop: function(punc) {
    if (this.currentSentence.length > 2 && this.currentSentence[this.currentSentence.length-3] === ' ' && this.currentSentence[this.currentSentence.length-2] === '-' && this.currentSentence[this.currentSentence.length-1] === ' ') {
      this.currentSentence = this.currentSentence.slice(0,-3) + (punc || '.');
    }
    else if (this.currentSentence.length > 1 && this.currentSentence[this.currentSentence.length-2] === ',' && this.currentSentence[this.currentSentence.length-1] === ' ') {
      this.currentSentence = this.currentSentence.slice(0,-2) + (punc || '.');
    }
    else if (this.currentSentence.length > 0 && this.currentSentence[this.currentSentence.length-1] === ' ') {
      this.currentSentence = this.currentSentence.slice(0,-1) + (punc || '.');
    }
    else {
      this.currentSentence += (punc || '.');
    }
    return this;
  },
  concat: function(words,punc) {
    if (!words) {
      return this;
    }
    if (!this.currentSentence && words) {
      if (this.currentParagraph && this.currentParagraph.length > 1 && this.currentParagraph.slice(-2) !== '. ') {
        this.currentSentence += words[0];
      }
      else {
        this.currentSentence += words[0].toUpperCase();
      }
      if (words.length > 1) {
        this.currentSentence += words.slice(1);
      }
      if (punc) {
        switch (punc) {
          case ',':
            this.currentSentence += ', ';
            break;
          case '-':
            this.currentSentence += ' - ';
            break;
          default:
            this.currentSentence += ' ';
            break;
        }
      }
      else {
        this.currentSentence += ' ';
      }
    }
    else if (words) {
      if (punc) {
        if (this.currentSentence.length > 2 && this.currentSentence[this.currentSentence.length-3] === ' ' && this.currentSentence[this.currentSentence.length-2] === '-' && this.currentSentence[this.currentSentence.length-1] === ' ') {
          this.currentSentence = this.currentSentence.slice(0,-3);
        }
        else if (this.currentSentence.length > 1 && this.currentSentence[this.currentSentence.length-2] === ',' && this.currentSentence[this.currentSentence.length-1] === ' ') {
          this.currentSentence = this.currentSentence.slice(0,-2);
        }
        else if (this.currentSentence.length > 0 && this.currentSentence[this.currentSentence.length-1] === ' ') {
          this.currentSentence = this.currentSentence.slice(0,-1);
        }
        switch (punc) {
          case ',':
            this.currentSentence += ', ' + words + ', ';
            break;
          case '-':
            this.currentSentence += ' - ' + words + ' - ';
            break;
          case '(':
          case ')':
            this.currentSentence += ' (' + words + ') ';
            break;
          default:
            this.currentSentence += ' ' + words + ' ';
            break;
        }
      }
      else {
        if (this.currentSentence.length > 0 && this.currentSentence[this.currentSentence.length-1] === ' ') {
          this.currentSentence = this.currentSentence.slice(0,-1);
        }
        this.currentSentence += ' ' + words + ' ';
      }
    }
    return this;
  },
  tone: function(filepath,keyword) {
    if (!filepath) {
      return;
    }
    let inputObj = {};
    let outputObj = {};
    try {
      inputObj = JSON.parse(fs.readFileSync(filepath + '.json'));
    }
    catch (error) {
      console.log(error);
      throw Error('Error parsing JSON from external file.');
    }
    if (inputObj.hasOwnProperty('prefix') && inputObj.hasOwnProperty('singular') && inputObj.hasOwnProperty('plural') && inputObj.hasOwnProperty('break') && inputObj.hasOwnProperty('suffix') && inputObj.hasOwnProperty('phrasalVerbInfinitive') && inputObj.hasOwnProperty('phrasalVerbGerund') && inputObj.hasOwnProperty('beforeAdverb') && inputObj.hasOwnProperty('afterAdverb')) {
      outputObj.prefix = rand(...inputObj.prefix).replace(/{}/g,(keyword || '{}'));
      outputObj.singular = rand(...inputObj.singular).replace(/{}/g,(keyword || '{}'));
      outputObj.plural = rand(...inputObj.plural).replace(/{}/g,(keyword || '{}'));
      outputObj.break = rand(...inputObj.break).replace(/{}/g,(keyword || '{}'));
      outputObj.suffix = rand(...inputObj.suffix).replace(/{}/g,(keyword || '{}'));
      outputObj.phrasalVerbInfinitive = rand(...inputObj.phrasalVerbInfinitive).replace(/{}/g,(keyword || '{}'));
      outputObj.phrasalVerbGerund = rand(...inputObj.phrasalVerbGerund).replace(/{}/g,(keyword || '{}'));
      outputObj.beforeAdverb = rand(...inputObj.beforeAdverb).replace(/{}/g,(keyword || '{}'));
      outputObj.afterAdverb = rand(...inputObj.afterAdverb).replace(/{}/g,(keyword || '{}'));
    }
    return outputObj;
  },
  randomTone: function(filepath,keyword) {
    if (!filepath) {
      return;
    }
    try {
      let obj = this.tone(filepath,keyword);
      let num = rand(1,2,3,4,5,6,7);
      switch (num) {
        case 1:
          obj.break = '';
          obj.suffix = '';
          obj.phrasalVerbInfinitive = '';
          obj.phrasalVerbGerund = '';
          obj.beforeAdverb = '';
          obj.afterAdverb = '';
          break;
        case 2:
          obj.prefix = '';
          obj.suffix = '';
          obj.phrasalVerbInfinitive = '';
          obj.phrasalVerbGerund = '';
          obj.beforeAdverb = '';
          obj.afterAdverb = '';
          break;
        case 3:
          obj.prefix = '';
          obj.break = '';
          obj.phrasalVerbInfinitive = '';
          obj.phrasalVerbGerund = '';
          obj.beforeAdverb = '';
          obj.afterAdverb = '';
          break;
        case 4:
          obj.prefix = '';
          obj.break = '';
          obj.suffix = '';
          obj.phrasalVerbGerund = '';
          obj.beforeAdverb = '';
          obj.afterAdverb = '';
          break;
        case 5:
          obj.prefix = '';
          obj.break = '';
          obj.suffix = '';
          obj.phrasalVerbInfinitive = '';
          obj.beforeAdverb = '';
          obj.afterAdverb = '';
          break;
        case 6:
          obj.prefix = '';
          obj.break = '';
          obj.suffix = '';
          obj.phrasalVerbInfinitive = '';
          obj.phrasalVerbGerund = '';
          obj.afterAdverb = '';
          break;
        case 7:
          obj.prefix = '';
          obj.break = '';
          obj.suffix = '';
          obj.phrasalVerbInfinitive = '';
          obj.phrasalVerbGerund = '';
          obj.beforeAdverb = '';
          break;
      }
      return obj;
    }
    catch (error) {
      console.log(error);
      throw Error('Error parsing JSON from external file.');
    }
  },
  type: function(sentenceObj) {
    if (!sentenceObj || typeof sentenceObj !== 'object') {
      return;
    }
    if (sentenceObj.subject && sentenceObj.verb && !sentenceObj.object && !sentenceObj.complement && !sentenceObj.passive) {
      return 'verb';
    }
    else if (sentenceObj.subject && sentenceObj.verb && sentenceObj.object && !sentenceObj.complement && !sentenceObj.passive) {
      return 'object';
    }
    else if (sentenceObj.subject && sentenceObj.verb && !sentenceObj.object && sentenceObj.complement && !sentenceObj.passive) {
      return 'complement';
    }
    else if (sentenceObj.subject && sentenceObj.verb && sentenceObj.object && sentenceObj.complement && !sentenceObj.passive) {
      return 'object-complement';
    }
    else if (sentenceObj.subject && sentenceObj.verb && sentenceObj.object && !sentenceObj.complement && sentenceObj.passive) {
      return 'passive';
    }
    else {
      return 'invalid';
    }
  },
  callVerb: function(verbString,sentenceObj) {
    if (!verbString || !sentenceObj) {
      return;
    }
    if (sentenceObj.tense === 'past') {
      return verb(verbString).past(person(sentenceObj.subjectPronoun),...(sentenceObj.verbOptions || [0,0,0]));
    }
    else if (sentenceObj.tense === 'future') {
      return verb(verbString).future(person(sentenceObj.subjectPronoun),...(sentenceObj.verbOptions || [0,0,0]));
    }
    else {
      return verb(verbString).present(person(sentenceObj.subjectPronoun),...(sentenceObj.verbOptions || [0,0,0]));
    }
  },
  clauseProperties: function(sentenceObj,pathOne,keywordOne,pathTwo,keywordTwo) {
    if (!sentenceObj || typeof sentenceObj !== 'object') {
      return;
    }
    let outputObj = {};
    let toneOne = this.randomTone(pathOne,keywordOne) || {};
    let toneTwo = this.randomTone(pathTwo,keywordTwo) || {};
    let mainVerb = sentenceObj.verb;
    outputObj.conjunctionBefore = rand((sentenceObj.conjunctionBefore || ''),(sentenceObj.conjunctionMoveable || ''),'');
    if (!outputObj.conjunctionBefore) {
      outputObj.conjunctionAfter = rand((sentenceObj.conjunctionAfter || ''),(sentenceObj.conjunctionMoveable || ''),'')
    }
    else {
      outputObj.conjunctionAfter = '';
    }
    if (sentenceObj.adjunctRequired) {
      outputObj.adjunctBefore = '';
      outputObj.adjunctMiddle = '';
      outputObj.adjunctAfter = sentenceObj.adjunctAfter;
    }
    else {
      outputObj.adjunctBefore = rand((sentenceObj.adjunctBefore || ''),(sentenceObj.adjunctMoveable || ''),'');
      outputObj.adjunctMiddle = '';
      outputObj.adjunctAfter = '';
      if (!outputObj.adjunctBefore) {
        outputObj.adjunctMiddle = rand((sentenceObj.adjunctMoveable || ''),'','');
      }
      if (!outputObj.adjunctBefore && !outputObj.adjunctMiddle) {
        outputObj.adjunctAfter = rand((sentenceObj.adjunctAfter || ''),(sentenceObj.adjunctMoveable || ''),'');
      }
    }
    if (toneOne.prefix && toneTwo.prefix) {
      outputObj.prefix = toneOne.prefix + ' ' + toneTwo.prefix;
    }
    else {
      outputObj.prefix = toneOne.prefix || toneTwo.prefix || '';
    }
    if (toneOne.break && toneTwo.break) {
      outputObj.break = toneOne.break + ' and ' + toneTwo.break;
    }
    else {
      outputObj.break = toneOne.break || toneTwo.break || '';
    }
    if (toneOne.suffix && toneTwo.suffix) {
      outputObj.suffix = toneOne.suffix + ' and ' + toneTwo.suffix;
    }
    else {
      outputObj.suffix = toneOne.suffix || toneTwo.suffix || '';
    }
    if (toneOne.beforeAdverb && toneTwo.beforeAdverb) {
      outputObj.beforeAdverb = toneOne.beforeAdverb + ' and ' + toneTwo.beforeAdverb;
    }
    else {
      outputObj.beforeAdverb = toneOne.beforeAdverb || toneTwo.beforeAdverb || '';
    }
    if (toneOne.afterAdverb && toneTwo.afterAdverb) {
      outputObj.afterAdverb = toneOne.afterAdverb + ' and ' + toneTwo.afterAdverb;
    }
    else {
      outputObj.afterAdverb = toneOne.afterAdverb || toneTwo.afterAdverb || '';
    }
    if (toneOne.phrasalVerbInfinitive && toneTwo.phrasalVerbInfinitive) {
      let toneOneMainVerb = this.callVerb(toneOne.phrasalVerbInfinitive.split(' ')[0],sentenceObj);
      let toneTwoMainVerb = this.callVerb(toneTwo.phrasalVerbInfinitive.split(' ')[0],sentenceObj);
      let toneOneVerbSuffix = toneOne.phrasalVerbInfinitive.split(' ').slice(1).join(' ') || '';
      let toneTwoVerbSuffix = toneTwo.phrasalVerbInfinitive.split(' ').slice(1).join(' ') || '';
      outputObj.verb = toneOneMainVerb;
      if (toneOneVerbSuffix) {
        outputObj.verb += ' ' + toneOneVerbSuffix;
      }
      outputObj.verb += ' and ' + toneTwoMainVerb;
      if (toneTwoVerbSuffix) {
        outputObj.verb += ' ' + toneTwoVerbSuffix;
      }
      outputObj.verb += ' ' + mainVerb;
    }
    else if (toneOne.phrasalVerbInfinitive) {
      let toneMainVerb = this.callVerb(toneOne.phrasalVerbInfinitive.split(' ')[0],sentenceObj);
      let toneVerbSuffix = toneOne.phrasalVerbInfinitive.split(' ').slice(1).join(' ') || '';
      outputObj.verb = toneMainVerb;
      if (toneVerbSuffix) {
        outputObj.verb += ' ' + toneVerbSuffix;
      }
      outputObj.verb += ' ' + mainVerb;
    }
    else if (toneTwo.phrasalVerbInfinitive) {
      let toneMainVerb = this.callVerb(toneTwo.phrasalVerbInfinitive.split(' ')[0],sentenceObj);
      let toneVerbSuffix = toneTwo.phrasalVerbInfinitive.split(' ').slice(1).join(' ') || '';
      outputObj.verb = toneMainVerb;
      if (toneVerbSuffix) {
        outputObj.verb += ' ' + toneVerbSuffix;
      }
      outputObj.verb += ' ' + mainVerb;
    }
    else if (toneOne.phrasalVerbGerund && toneTwo.phrasalVerbGerund) {
      let toneOneMainVerb = this.callVerb(toneOne.phrasalVerbGerund.split(' ')[0],sentenceObj);
      let toneTwoMainVerb = this.callVerb(toneTwo.phrasalVerbGerund.split(' ')[0],sentenceObj);
      let toneOneVerbSuffix = toneOne.phrasalVerbGerund.split(' ').slice(1).join(' ') || '';
      let toneTwoVerbSuffix = toneTwo.phrasalVerbGerund.split(' ').slice(1).join(' ') || '';
      outputObj.verb = toneOneMainVerb;
      if (toneOneVerbSuffix) {
        outputObj.verb += ' ' + toneOneVerbSuffix;
      }
      outputObj.verb += ' and ' + toneTwoMainVerb;
      if (toneTwoVerbSuffix) {
        outputObj.verb += ' ' + toneTwoVerbSuffix;
      }
      outputObj.verb += ' ' + verb(mainVerb).continuous;
    }
    else if (toneOne.phrasalVerbGerund) {
      let toneMainVerb = this.callVerb(toneOne.phrasalVerbGerund.split(' ')[0],sentenceObj);
      let toneVerbSuffix = toneOne.phrasalVerbGerund.split(' ').slice(1).join(' ') || '';
      outputObj.verb = toneMainVerb;
      if (toneVerbSuffix) {
        outputObj.verb += ' ' + toneVerbSuffix;
      }
      outputObj.verb += ' ' + verb(mainVerb).continuous;
    }
    else if (toneTwo.phrasalVerbGerund) {
      let toneMainVerb = this.callVerb(toneTwo.phrasalVerbGerund.split(' ')[0],sentenceObj);
      let toneVerbSuffix = toneTwo.phrasalVerbGerund.split(' ').slice(1).join(' ') || '';
      outputObj.verb = toneMainVerb;
      if (toneVerbSuffix) {
        outputObj.verb += ' ' + toneVerbSuffix;
      }
      outputObj.verb += ' ' + verb(mainVerb).continuous;
    }
    else {
      outputObj.verb = this.callVerb(mainVerb,sentenceObj);
    }
    return outputObj;
  },
  clause: function(sentenceObj,pathOne,keywordOne,pathTwo,keywordTwo) {
    if (!sentenceObj || typeof sentenceObj !== 'object') {
      return;
    }
    let sentenceType = this.type(sentenceObj);
    if (sentenceType === 'invalid') {
      throw Error('Invalid sentence object entered.');
    }
    let selectedObj;
    let option;
    let mainVerb = sentenceObj.verb.split(' ')[0];
    let verbSuffix = sentenceObj.verb.split(' ').slice(1).join(' ') || '{{pronoun}}';
    switch (sentenceType) {
      case 'verb':
        selectedObj = {
          subject: sentenceObj.subject,
          subjectPronoun: (sentenceObj.subjectPronoun || 'it'),
          verb: mainVerb,
          verbOptions: (sentenceObj.verbOptions || [0,0,0]),
          tense: (sentenceObj.tense || 'present'),
          postVerb: verbSuffix.replace(/({{pronoun}}|{{pronoun\|object}}|{{object\|pronoun}})\s*/,''),
          object: '',
          objectPronoun: '',
          adverbBefore: (sentenceObj.adverbBefore || ''),
          adverbAfter: (sentenceObj.adverbAfter || ''),
          adjunctBefore: (sentenceObj.adjunctBefore || ''),
          adjunctMoveable: (sentenceObj.adjunctMoveable || ''),
          adjunctAfter: (sentenceObj.adjunctAfter || ''),
          adjunctRequired: (sentenceObj.adjunctRequired || false),
          conjunctionBefore: (sentenceObj.conjunctionBefore || ''),
          conjunctionMoveable: (sentenceObj.conjunctionMoveable || ''),
          conjunctionAfter: (sentenceObj.conjunctionAfter || '')
        };
        break;
      case 'object':
        option = rand(1,2);
        if (option === 1) {
          let postVerbComponents = '';
          if (verbSuffix) {
            postVerbComponents += verbSuffix + ' {{object}}';
          }
          else {
            postVerbComponents += '{{object}}';
          }
          selectedObj = {
            subject: sentenceObj.subject,
            subjectPronoun: (sentenceObj.subjectPronoun || 'it'),
            verb: mainVerb,
            verbOptions: (sentenceObj.verbOptions || [0,0,0]),
            tense: (sentenceObj.tense || 'present'),
            postVerb: postVerbComponents,
            object: sentenceObj.object,
            objectPronoun: (sentenceObj.objectPronoun || 'it'),
            adverbBefore: (sentenceObj.adverbBefore || ''),
            adverbAfter: (sentenceObj.adverbAfter || ''),
            adjunctBefore: (sentenceObj.adjunctBefore || ''),
            adjunctMoveable: (sentenceObj.adjunctMoveable || ''),
            adjunctAfter: (sentenceObj.adjunctAfter || ''),
            adjunctRequired: (sentenceObj.adjunctRequired || false),
            conjunctionBefore: (sentenceObj.conjunctionBefore || ''),
            conjunctionMoveable: (sentenceObj.conjunctionMoveable || ''),
            conjunctionAfter: (sentenceObj.conjunctionAfter || '')
          };
        }
        else if (option === 2) {
          let postVerbComponents = '';
          postVerbComponents += verb(mainVerb).perfect;
          if (verbSuffix.replace(/({{pronoun}}|{{pronoun\|object}}|{{object\|pronoun}})\s*/,'')) {
            postVerbComponents += ' ' + verbSuffix.replace(/({{pronoun}}|{{pronoun\|object}}|{{object\|pronoun}})\s*/,'') + ' by {{object|pronoun}}';
          }
          else {
            postVerbComponents += ' by {{object|pronoun}}';
          }
          selectedObj = {
            subject: sentenceObj.object,
            subjectPronoun: (sentenceObj.objectPronoun || 'it'),
            verb: rand('be','get'),
            verbOptions: (sentenceObj.verbOptions || [0,0,0]),
            tense: (sentenceObj.tense || 'present'),
            postVerb: postVerbComponents,
            object: sentenceObj.subject,
            objectPronoun: (sentenceObj.subjectPronoun || 'it'),
            adverbBefore: (sentenceObj.adverbBefore || ''),
            adverbAfter: (sentenceObj.adverbAfter || ''),
            adjunctBefore: (sentenceObj.adjunctBefore || ''),
            adjunctMoveable: (sentenceObj.adjunctMoveable || ''),
            adjunctAfter: (sentenceObj.adjunctAfter || ''),
            adjunctRequired: (sentenceObj.adjunctRequired || false),
            conjunctionBefore: (sentenceObj.conjunctionBefore || ''),
            conjunctionMoveable: (sentenceObj.conjunctionMoveable || ''),
            conjunctionAfter: (sentenceObj.conjunctionAfter || '')
          };
        }
        break;
      case 'complement':
        let postVerbComponents = '';
        if (verbSuffix.replace(/({{pronoun}}|{{pronoun\|object}}|{{object\|pronoun}})\s*/,'')) {
          postVerbComponents += verbSuffix.replace(/({{pronoun}}|{{pronoun\|object}}|{{object\|pronoun}})\s*/,'') + ' ' + sentenceObj.complement;
        }
        else {
          postVerbComponents += sentenceObj.complement;
        }
        selectedObj = {
          subject: sentenceObj.subject,
          subjectPronoun: (sentenceObj.subjectPronoun || 'it'),
          verb: mainVerb,
          verbOptions: (sentenceObj.verbOptions || [0,0,0]),
          tense: (sentenceObj.tense || 'present'),
          postVerb: postVerbComponents,
          object: '',
          objectPronoun: '',
          adverbBefore: (sentenceObj.adverbBefore || ''),
          adverbAfter: (sentenceObj.adverbAfter || ''),
          adjunctBefore: (sentenceObj.adjunctBefore || ''),
          adjunctMoveable: (sentenceObj.adjunctMoveable || ''),
          adjunctAfter: (sentenceObj.adjunctAfter || ''),
          adjunctRequired: (sentenceObj.adjunctRequired || false),
          conjunctionBefore: (sentenceObj.conjunctionBefore || ''),
          conjunctionMoveable: (sentenceObj.conjunctionMoveable || ''),
          conjunctionAfter: (sentenceObj.conjunctionAfter || '')
        };
        break;
      case 'object-complement':
        option = rand(1,2);
        if (option === 1) {
          let postVerbComponents = '';
          if (verbSuffix) {
            postVerbComponents += verbSuffix + ' {{object}} ' + sentenceObj.complement;
          }
          else {
            postVerbComponents += '{{object}} ' + sentenceObj.complement;
          }
          selectedObj = {
            subject: sentenceObj.subject,
            subjectPronoun: (sentenceObj.subjectPronoun || 'it'),
            verb: mainVerb,
            verbOptions: (sentenceObj.verbOptions || [0,0,0]),
            tense: (sentenceObj.tense || 'present'),
            postVerb: postVerbComponents,
            object: sentenceObj.object,
            objectPronoun: (sentenceObj.objectPronoun || 'it'),
            adverbBefore: (sentenceObj.adverbBefore || ''),
            adverbAfter: (sentenceObj.adverbAfter || ''),
            adjunctBefore: (sentenceObj.adjunctBefore || ''),
            adjunctMoveable: (sentenceObj.adjunctMoveable || ''),
            adjunctAfter: (sentenceObj.adjunctAfter || ''),
            adjunctRequired: (sentenceObj.adjunctRequired || false),
            conjunctionBefore: (sentenceObj.conjunctionBefore || ''),
            conjunctionMoveable: (sentenceObj.conjunctionMoveable || ''),
            conjunctionAfter: (sentenceObj.conjunctionAfter || '')
          };
        }
        else if (option === 2) {
          let postVerbComponents = '';
          postVerbComponents += verb(mainVerb).perfect;
          if (verbSuffix.replace(/({{pronoun}}|{{pronoun\|object}}|{{object\|pronoun}})\s*/,'')) {
            postVerbComponents += ' ' + verbSuffix.replace(/({{pronoun}}|{{pronoun\|object}}|{{object\|pronoun}})\s*/,'') + ' ' + sentenceObj.complement + ' by {{object|pronoun}}';
          }
          else {
            postVerbComponents += ' ' + sentenceObj.complement + ' by {{object|pronoun}}';
          }
          selectedObj = {
            subject: sentenceObj.object,
            subjectPronoun: (sentenceObj.objectPronoun || 'it'),
            verb: rand('be','get'),
            verbOptions: (sentenceObj.verbOptions || [0,0,0]),
            tense: (sentenceObj.tense || 'present'),
            postVerb: postVerbComponents,
            object: sentenceObj.subject,
            objectPronoun: (sentenceObj.subjectPronoun || 'it'),
            adverbBefore: (sentenceObj.adverbBefore || ''),
            adverbAfter: (sentenceObj.adverbAfter || ''),
            adjunctBefore: (sentenceObj.adjunctBefore || ''),
            adjunctMoveable: (sentenceObj.adjunctMoveable || ''),
            adjunctAfter: (sentenceObj.adjunctAfter || ''),
            adjunctRequired: (sentenceObj.adjunctRequired || false),
            conjunctionBefore: (sentenceObj.conjunctionBefore || ''),
            conjunctionMoveable: (sentenceObj.conjunctionMoveable || ''),
            conjunctionAfter: (sentenceObj.conjunctionAfter || '')
          };
        }
        break;
      case 'passive':
        option = rand(1,2,3);
        let passivePreposition = sentenceObj.passivePreposition || 'to';
        if (option === 1) {
          let postVerbComponents = '';
          if (verbSuffix) {
            postVerbComponents += verbSuffix + ' {{object}} ' + sentenceObj.passive;
          }
          else {
            postVerbComponents += '{{object}} ' + sentenceObj.passive;
          }
          selectedObj = {
            subject: sentenceObj.subject,
            subjectPronoun: (sentenceObj.subjectPronoun || 'it'),
            verb: mainVerb,
            verbOptions: (sentenceObj.verbOptions || [0,0,0]),
            tense: (sentenceObj.tense || 'present'),
            postVerb: postVerbComponents,
            object: sentenceObj.object,
            objectPronoun: (sentenceObj.objectPronoun || 'it'),
            adverbBefore: (sentenceObj.adverbBefore || ''),
            adverbAfter: (sentenceObj.adverbAfter || ''),
            adjunctBefore: (sentenceObj.adjunctBefore || ''),
            adjunctMoveable: (sentenceObj.adjunctMoveable || ''),
            adjunctAfter: (sentenceObj.adjunctAfter || ''),
            adjunctRequired: (sentenceObj.adjunctRequired || false),
            conjunctionBefore: (sentenceObj.conjunctionBefore || ''),
            conjunctionMoveable: (sentenceObj.conjunctionMoveable || ''),
            conjunctionAfter: (sentenceObj.conjunctionAfter || '')
          };
        }
        else if (option === 2) {
          let postVerbComponents = '';
          if (verbSuffix.replace(/({{pronoun}}|{{pronoun\|object}}|{{object\|pronoun}})\s*/,'')) {
            postVerbComponents += verbSuffix.replace(/({{pronoun}}|{{pronoun\|object}}|{{object\|pronoun}})\s*/,'') + ' ' + sentenceObj.passive + ' ' + passivePreposition + ' {{object|pronoun}}';
          }
          else {
            postVerbComponents += sentenceObj.passive + ' ' + passivePreposition + ' {{object|pronoun}}';;
          }
          selectedObj = {
            subject: sentenceObj.subject,
            subjectPronoun: (sentenceObj.subjectPronoun || 'it'),
            verb: mainVerb,
            verbOptions: (sentenceObj.verbOptions || [0,0,0]),
            tense: (sentenceObj.tense || 'present'),
            postVerb: postVerbComponents,
            object: sentenceObj.object,
            objectPronoun: (sentenceObj.objectPronoun || 'it'),
            adverbBefore: (sentenceObj.adverbBefore || ''),
            adverbAfter: (sentenceObj.adverbAfter || ''),
            adjunctBefore: (sentenceObj.adjunctBefore || ''),
            adjunctMoveable: (sentenceObj.adjunctMoveable || ''),
            adjunctAfter: (sentenceObj.adjunctAfter || ''),
            adjunctRequired: (sentenceObj.adjunctRequired || false),
            conjunctionBefore: (sentenceObj.conjunctionBefore || ''),
            conjunctionMoveable: (sentenceObj.conjunctionMoveable || ''),
            conjunctionAfter: (sentenceObj.conjunctionAfter || '')
          };
        }
        else if (option === 3) {
          let postVerbComponents = '';
          postVerbComponents += verb(mainVerb).perfect;
          if (verbSuffix.replace(/({{pronoun}}|{{pronoun\|object}}|{{object\|pronoun}})\s*/,'')) {
            postVerbComponents += ' ' + verbSuffix.replace(/({{pronoun}}|{{pronoun\|object}}|{{object\|pronoun}})\s*/,'') + ' ' + sentenceObj.passive + ' by {{object|pronoun}}';
          }
          else {
            postVerbComponents += ' ' + sentenceObj.passive + ' by {{object|pronoun}}';
          }
          selectedObj = {
            subject: sentenceObj.object,
            subjectPronoun: (sentenceObj.objectPronoun || 'it'),
            verb: rand('be','get'),
            verbOptions: (sentenceObj.verbOptions || [0,0,0]),
            tense: (sentenceObj.tense || 'present'),
            postVerb: postVerbComponents,
            object: sentenceObj.subject,
            objectPronoun: (sentenceObj.subjectPronoun || 'it'),
            adverbBefore: (sentenceObj.adverbBefore || ''),
            adverbAfter: (sentenceObj.adverbAfter || ''),
            adjunctBefore: (sentenceObj.adjunctBefore || ''),
            adjunctMoveable: (sentenceObj.adjunctMoveable || ''),
            adjunctAfter: (sentenceObj.adjunctAfter || ''),
            adjunctRequired: (sentenceObj.adjunctRequired || false),
            conjunctionBefore: (sentenceObj.conjunctionBefore || ''),
            conjunctionMoveable: (sentenceObj.conjunctionMoveable || ''),
            conjunctionAfter: (sentenceObj.conjunctionAfter || '')
          };
        }
        break;
    }
    let props = this.clauseProperties(selectedObj,pathOne,keywordOne,pathTwo,keywordTwo);
    return {
      adjunctBefore: props.adjunctBefore,
      adjunctMiddle: props.adjunctMiddle,
      adjunctAfter: props.adjunctAfter,
      conjunctionBefore: props.conjunctionBefore,
      conjunctionAfter: props.conjunctionAfter,
      adverbBefore: (props.beforeAdverb || selectedObj.adverbBefore || ''),
      adverbAfter: (props.afterAdverb || selectedObj.adverbAfter || ''),
      prefix: props.prefix,
      suffix: props.suffix,
      break: props.break,
      verb: props.verb,
      postVerb: selectedObj.postVerb,
      subject: selectedObj.subject,
      subjectPronoun: selectedObj.subjectPronoun,
      object: selectedObj.object,
      objectPronoun: selectedObj.objectPronoun
    };
  },
  print: function(sentenceObj,subjectPronoun,objectPronoun,fromSubject,fromPostVerb) {
    if (!sentenceObj || typeof sentenceObj !== 'object') {
      return;
    }
    let subject, object;
    if (subjectPronoun) {
      subject = sentenceObj.subjectPronoun || '';
    }
    else {
      subject = sentenceObj.subject || '';
    }
    let postVerb = '';
    if (sentenceObj.postVerb && sentenceObj.postVerb.match(/({{pronoun\|object}}|{{object\|pronoun}})/) && sentenceObj.postVerb.match(/({{object}}|{{pronoun}})/)) {
      postVerb = sentenceObj.postVerb.replace(/\s*({{object}}|{{pronoun}})/,'');
    }
    else {
      postVerb = sentenceObj.postVerb || '';
    }
    if (objectPronoun) {
      object = pronoun.passive(sentenceObj.objectPronoun) || '';
      postVerb = postVerb.replace(/({{object\|pronoun}}|{{pronoun\|object}}|{{pronoun}})/,object).replace(/\s*{{object}}\s*/,'');
    }
    else {
      object = sentenceObj.object || '';
      postVerb = postVerb.replace(/({{object\|pronoun}}|{{pronoun\|object}}|{{object}})/,object).replace(/\s*{{pronoun}}\s*/,'');;
    }
    if (!fromSubject && !fromPostVerb) {
      this.concat((sentenceObj.prefix||'')).concat((sentenceObj.conjunctionBefore||''),rand(',',' ','-')).concat((sentenceObj.adjunctBefore||''),rand(',',' ')).concat(subject).concat((sentenceObj.adjunctMiddle||''),rand(',','-','(')).concat((sentenceObj.adverbBefore||'')).concat((sentenceObj.verb||'')).concat((sentenceObj.break||''),rand(',','-','(')).concat((postVerb||'')).concat((sentenceObj.adverbAfter||'')).concat((sentenceObj.adjunctAfter||''),rand(',',' ')).concat((sentenceObj.conjunctionAfter||''),rand(',',' ','-')).concat((sentenceObj.suffix||''),rand(',','-'));
    }
    else if (fromSubject) {
      this.concat((sentenceObj.adjunctMiddle||''),rand(',','-','(')).concat((sentenceObj.adverbBefore||'')).concat((sentenceObj.verb||'')).concat((sentenceObj.break||''),rand(',','-','(')).concat((postVerb||'')).concat((sentenceObj.adverbAfter||'')).concat((sentenceObj.adjunctAfter||''),rand(',',' ')).concat((sentenceObj.conjunctionAfter||''),rand(',',' ','-')).concat((sentenceObj.suffix||''),rand(',','-'));
    }
    else if (fromPostVerb) {
      this.concat((postVerb||'')).concat((sentenceObj.adverbAfter||'')).concat((sentenceObj.adjunctAfter||''),rand(',',' ')).concat((sentenceObj.conjunctionAfter||''),rand(',',' ','-')).concat((sentenceObj.suffix||''),rand(',','-'));
    }
    return this;
  },
  capitals: function(rawString) {
    if (!rawString || typeof rawString !== 'string') {
      throw Error('You must enter a string to capitalize.');
    }
    if (rawString.length > 1) {
      return rawString[0].toUpperCase() + rawString.slice(1);
    }
    else {
      return rawString.toUpperCase();
    }
  },
  match: function(sentenceOne,sentenceTwo) {
    if (!sentenceOne || !sentenceTwo) {
      return false;
    }
    if (sentenceOne.subject === sentenceTwo.subject && sentenceOne.object === sentenceTwo.object && sentenceOne.verb !== sentenceTwo.verb) {
      return 'subject-object';
    }
    else if (sentenceOne.subject === sentenceTwo.subject && sentenceOne.verb === sentenceTwo.verb) {
      return 'subject-verb';
    }
    else if (sentenceTwo.subject === sentenceOne.subject || sentenceTwo.subject === sentenceOne.object) {
      return 'subject';
    }
    else if (sentenceTwo.object === sentenceOne.subject || sentenceTwo.object === sentenceOne.object) {
      return 'object';
    }
    return false;
  },
  paragraph: function(sentenceObjs) {
    if (!sentenceObjs || sentenceObjs.length < 1) {
      throw Error('Must enter sentence objects to make a paragraph.');
    }
    this.start();
    let i = 0;
    let nextStop = false;
    let thisStop = false;
    while (i < sentenceObjs.length) {
      if (i === sentenceObjs.length-1) {
        thisStop = true;
      }
      else if (!nextStop) {
        nextStop = (i === sentenceObjs.length-2) || rand(true,false);
      }
      else {
        thisStop = true;
        nextStop = false;
      }
      if (!nextStop && !thisStop) {
        thisStop = (i === sentenceObjs.length-1) || rand(true,false);
      }
      if (i > 0) {
        let isSubjectPronoun, isObjectPronoun, isFromSubject, isFromPostVerb;
        let matchedSentence = this.match(sentenceObjs[i-1],sentenceObjs[i]);
        switch (matchedSentence) {
          case 'subject':
            if (this.currentParagraph.length > 1 && (this.currentParagraph.slice(-2) === '. ' || this.currentParagraph.slice(-1) === '.')) {
              isSubjectPronoun = true; isObjectPronoun = false; isFromSubject = false; isFromPostVerb = false;
            }
            else {
              isSubjectPronoun = true; isObjectPronoun = false; isFromSubject = rand(true,false); isFromPostVerb = false;
            }
            break;
          case 'object':
            isSubjectPronoun = false; isObjectPronoun = true; isFromSubject = false; isFromPostVerb = false;
            break;
          case 'subject-object':
            if (this.currentParagraph.length > 1 && (this.currentParagraph.slice(-2) === '. ' || this.currentParagraph.slice(-1) === '.')) {
              isSubjectPronoun = true; isObjectPronoun = true; isFromSubject = false; isFromPostVerb = false;
            }
            else {
              isSubjectPronoun = true; isObjectPronoun = true; isFromSubject = rand(true,false); isFromPostVerb = false;
            }
            break;
          case 'subject-verb':
            if (this.currentParagraph.length > 1 && (this.currentParagraph.slice(-2) === '. ' || this.currentParagraph.slice(-1) === '.')) {
              isSubjectPronoun = true; isObjectPronoun = false; isFromSubject = false; isFromPostVerb = false;
            }
            else {
              isSubjectPronoun = true; isObjectPronoun = false; isFromSubject = rand(true,false); isFromPostVerb = rand(true,false);
            }
            break;
          default:
            isSubjectPronoun = false; isObjectPronoun = false; isFromSubject = false; isFromPostVerb = false;
            break;
        }
        if (thisStop && i !== sentenceObjs.length-1) {
          this.print(sentenceObjs[i],isSubjectPronoun,isObjectPronoun,isFromSubject,isFromPostVerb).stop('. ').add().start();
        }
        else if (thisStop && i === sentenceObjs.length-1) {
          this.print(sentenceObjs[i],isSubjectPronoun,isObjectPronoun,isFromSubject,isFromPostVerb).stop('.').add().start();
        }
        else if (nextStop) {
          this.print(sentenceObjs[i],isSubjectPronoun,isObjectPronoun,isFromSubject,isFromPostVerb).stop(' and ').add().start();
        }
        else {
          this.print(sentenceObjs[i],isSubjectPronoun,isObjectPronoun,isFromSubject,isFromPostVerb).stop(', ').add().start();
        }
      }
      else {
        if (thisStop && i !== sentenceObjs.length-1) {
          this.print(sentenceObjs[i],false,false,false,false).stop('. ').add().start();
        }
        else if (thisStop && i === sentenceObjs.length-1) {
          this.print(sentenceObjs[i],false,false,false,false).stop('.').add().start();
        }
        else if (nextStop) {
          this.print(sentenceObjs[i],false,false,false,false).stop(' and ').add().start();
        }
        else {
          this.print(sentenceObjs[i],false,false,false,false).stop(', ').add().start();
        }
      }
      i++;
    }
    return this;
  },
  addWithTag: function(tag,sentenceObj,pathOne,keywordOne,pathTwo,keywordTwo) {
    if (!tag || !sentenceObj) {
      throw Error('You must enter a tag and sentence object to add.');
    }
    if (!this.tagsToPrint.hasOwnProperty(tag)) {
      this.tagsToPrint[tag] = [];
    }
    this.tagsToPrint[tag].push(this.clause(sentenceObj,pathOne,keywordOne,pathTwo,keywordTwo));
    return this;
  },
  addWithTagFromPath: function(tag,path) {
    if (!tag || !path) {
      throw Error('You must enter a tag and sentence object to add.');
    }
    let parsedObj;
    try {
      parsedObj = JSON.parse(fs.readFileSync(path + '.json'));
    }
    catch (error) {
      console.log(error);
      throw Error('Error parsing JSON from external file.');
    }
    parsedObj.sentenceObj.subject = rand(...parsedObj.sentenceObj.subject);
    parsedObj.sentenceObj.verb = rand(...parsedObj.sentenceObj.verb);
    parsedObj.sentenceObj.complement = rand(...parsedObj.sentenceObj.complement);
    parsedObj.sentenceObj.object = rand(...parsedObj.sentenceObj.object);
    parsedObj.sentenceObj.passive = rand(...parsedObj.sentenceObj.passive);
    parsedObj.sentenceObj.adverbBefore = rand(...parsedObj.sentenceObj.adverbBefore);
    parsedObj.sentenceObj.adverbAfter = rand(...parsedObj.sentenceObj.adverbAfter);
    parsedObj.sentenceObj.adjunctBefore = rand(...parsedObj.sentenceObj.adjunctBefore);
    parsedObj.sentenceObj.adjunctMoveable = rand(...parsedObj.sentenceObj.adjunctMoveable);
    parsedObj.sentenceObj.adjunctAfter = rand(...parsedObj.sentenceObj.adjunctAfter);
    parsedObj.sentenceObj.conjunctionBefore = rand(...parsedObj.sentenceObj.conjunctionBefore);
    parsedObj.sentenceObj.conjunctionMoveable = rand(...parsedObj.sentenceObj.conjunctionMoveable);
    parsedObj.sentenceObj.conjunctionAfter = rand(...parsedObj.sentenceObj.conjunctionAfter);
    if (!this.tagsToPrint.hasOwnProperty(tag)) {
      this.tagsToPrint[tag] = [];
    }
    this.tagsToPrint[tag].push(this.clause(parsedObj.sentenceObj,parsedObj.pathOne,parsedObj.keywordOne,parsedObj.pathTwo,parsedObj.keywordTwo));
    return this;
  },
  printFromTags: function() {
    for (let tag in this.tagsToPrint) {
      this.paragraph(this.tagsToPrint[tag]);
    }
    return this;
  },
  sourceContains: function(search) {
    if (!search || typeof search !== 'object' || search.length < 1) {
      throw Error('No source found to search.');
    }
    if (this.source) {
      let regex;
      let match = false;
      for (let i = 0; i < search.length; i++) {
        regex = new RegExp('\\b' + search[i] + '\\b','i');
        if (this.source.match(regex)) {
          match = true;
          break;
        }
      }
      return match;
    }
    return false;
  },
  sourceReplace: function(searchRegex,replacementRegex,replaceSource) {
    if (!searchRegex || !replacementRegex) {
      throw Error('No source found to search.');
    }
    if (!replaceSource) {
      replaceSource = this.source;
    }
    if (this.currentParagraph && this.currentParagraph.match(searchRegex)) {
      let filteredTag = replaceSource.match(replacementRegex)[0];
      filteredTag = filteredTag.replace(/(\n|\r)/,'').replace(/(<[a-zA-Z]+>|<[a-zA-Z]+.*?[^?]>|<\/[a-zA-Z0-9]+>)/gi,'');
      this.currentParagraph = this.currentParagraph.replace(searchRegex,filteredTag);
      for (let i = 0; i < this.currentParagraphArray.length; i++) {
        this.currentParagraphArray[i] = this.currentParagraphArray[i].replace(searchRegex,filteredTag);
      }
      return true;
    }
    return false;
  },
  sourceFromUrl: function(url,start,end) {
    if (!url) {
      throw Error('No source found to search.');
    }
    if (!start) {
      start = '';
    }
    if (!end) {
      end = '';
    }
    http.get(url, res => {
      let html = '';
      res.on('data', data => {
        html += data;
      });
      res.on('end', () => {
        html = html.replace(/(\n|\r)/g,'');
        let regex = new RegExp(start + '.+' + end,'i');
        this.source = html.match(regex)[0];
        if (!this.source) {
          throw Error('Match for selected input not found.');
        }
        return this;
      });
    }).on('error', error => {
      console.log(error);
      throw Error('Error loading external URL.');
    });
  },
  out: function() {
    if (this.currentParagraphArray && this.currentParagraphArray.length > 0) {
      return {
        string: this.currentParagraphArray.join(' '),
        array: this.currentParagraphArray
      };
    }
    throw Error('Current paragraph is currently empty.');
  }

};
