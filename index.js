const rand = require('bmjs-random');
const person = require('bmjs-engperson');
const verb = require('bmjs-engverb');
const pronoun = require('bmjs-engpronouns');
const fs = require('fs');

module.exports = {
  currentSentence: '',
  currentParagraph: '',
  start: function() {
    this.currentSentence = '';
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
    if (!this.currentSentence && words) {
      this.currentSentence += words[0].toUpperCase();
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
    let inputObj = {};
    let outputObj = {};
    if (filepath) {
      try {
        inputObj = JSON.parse(fs.readFile(filepath + '.json'));
      }
      catch (error) {
        console.log(error);
      }
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
  }
};
