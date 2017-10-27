const expect = require('chai').expect;
const sentence = require('../index');

describe('sentence', () => {

  it('should return an object', () => {
    expect(sentence).to.be.an('object');
    expect(sentence).to.not.be.undefined;
  });

  it('current sentence should start empty', () => {
    expect(sentence.start().currentSentence).to.be.a('string');
    expect(sentence.start().currentSentence).to.equal('');
    expect(sentence.start().currentSentence).to.not.be.undefined;
  });

  it('current sentence should properly concat strings with proper grammar', () => {
    expect(sentence.start().concat('hi').currentSentence).to.be.a('string');
    expect(sentence.start().concat('hi').currentSentence).to.equal('Hi ');
    expect(sentence.start().concat('hi').currentSentence).to.not.be.undefined;
    expect(sentence.start().concat('hi').concat('my name is').concat('Brent').stop().currentSentence).to.equal('Hi my name is Brent.');
    expect(sentence.start().concat('hi',',').concat('my name is').concat('Brent').stop().currentSentence).to.equal('Hi, my name is Brent.');
    expect(sentence.start().concat('hi','-').concat('my name is').concat('Brent').stop().currentSentence).to.equal('Hi - my name is Brent.');
    expect(sentence.start().concat('hi').concat('my name is','(').concat('Brent').stop().currentSentence).to.equal('Hi (my name is) Brent.');
    expect(sentence.start().concat('hi').concat('my name is',',').concat('Brent').stop().currentSentence).to.equal('Hi, my name is, Brent.');
    expect(sentence.start().concat('hi').concat('my name is','-').concat('Brent').stop().currentSentence).to.equal('Hi - my name is - Brent.');
    expect(sentence.start().concat('hi').concat('my name is').concat('Brent',',').stop().currentSentence).to.equal('Hi my name is, Brent.');
    expect(sentence.start().concat('hi').concat('my name is').concat('Brent','-').stop().currentSentence).to.equal('Hi my name is - Brent.');
    expect(sentence.start().concat('hi').concat('my name is').concat('Brent',')').stop().currentSentence).to.equal('Hi my name is (Brent).');
    expect(sentence.start().concat('hi').concat('my name is').concat('Brent').concat('and',',').concat('I').concat('like to').concat('play the guitar').stop().currentSentence).to.equal('Hi my name is Brent, and, I like to play the guitar.');
  });

});
