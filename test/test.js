const expect = require('chai').expect;
const sentence = require('../index');
const eg = require('../example');

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
    sentence.init();
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

  it('tone should create an object from file path with correct properties', () => {
    expect(sentence.tone('test/test-tone')).to.be.an('object');
    expect(sentence.tone('test/test-tone')).to.deep.equal({
      prefix: "1",
      singular: "2",
      plural: "3",
      break: "4",
      suffix: "5",
      phrasalVerbInfinitive: "6",
      phrasalVerbGerund: "7",
      beforeAdverb: "8",
      afterAdverb: "9"
    });
    expect(sentence.tone('test/test-tone')).to.not.be.undefined;
  });

  it('tone should properly replace keyword placeholders', () => {
    expect(sentence.tone('test/test-tone-kw','KEYWORD')).to.be.an('object');
    expect(sentence.tone('test/test-tone-kw','KEYWORD')).to.deep.equal({
      prefix: "1 KEYWORD",
      singular: "2 KEYWORD",
      plural: "3 KEYWORD",
      break: "4 KEYWORD",
      suffix: "5 KEYWORD",
      phrasalVerbInfinitive: "6 KEYWORD",
      phrasalVerbGerund: "7 KEYWORD",
      beforeAdverb: "8 KEYWORD",
      afterAdverb: "9 KEYWORD"
    });
    expect(sentence.tone('test/test-tone-kw','KEYWORD')).to.not.be.undefined;
  });

  it('random tone should properly call function and create object properties', () => {
    expect(sentence.randomTone('test/test-tone')).to.be.an('object');
    expect(sentence.randomTone('test/test-tone')).to.have.property('prefix');
    expect(sentence.randomTone('test/test-tone')).to.have.property('singular');
    expect(sentence.randomTone('test/test-tone')).to.have.property('plural');
    expect(sentence.randomTone('test/test-tone')).to.have.property('break');
    expect(sentence.randomTone('test/test-tone')).to.have.property('suffix');
    expect(sentence.randomTone('test/test-tone')).to.have.property('phrasalVerbInfinitive');
    expect(sentence.randomTone('test/test-tone')).to.have.property('phrasalVerbGerund');
    expect(sentence.randomTone('test/test-tone')).to.have.property('beforeAdverb');
    expect(sentence.randomTone('test/test-tone')).to.have.property('afterAdverb');
    expect(sentence.randomTone('test/test-tone')).to.not.be.undefined;
  });

  it('type should return a sentence type string from the correct properties', () => {
    expect(sentence.type({})).to.equal('invalid');
    expect(sentence.type({subject:'1',verb:'2',complement:'3',object:'4',passive:'5'})).to.be.a('string');
    expect(sentence.type({subject:'1',verb:'2',complement:'',object:'',passive:''})).to.equal('verb');
    expect(sentence.type({subject:'1',verb:'2',complement:'3',object:'',passive:''})).to.equal('complement');
    expect(sentence.type({subject:'1',verb:'2',complement:'',object:'3',passive:''})).to.equal('object');
    expect(sentence.type({subject:'1',verb:'2',complement:'3',object:'4',passive:''})).to.equal('object-complement');
    expect(sentence.type({subject:'1',verb:'2',complement:'',object:'3',passive:'4'})).to.equal('passive');
    expect(sentence.type({subject:'1',verb:'2',complement:'3',object:'4',passive:'5'})).to.not.be.undefined;
  });

  it('clause properties should return an object with correct properties', () => {
    expect(sentence.clauseProperties({verb: 'be', subjectPronoun: 'i', tense: 'present'})).to.be.an('object');
    expect(sentence.clauseProperties({verb: 'be', subjectPronoun: 'i', tense: 'present'})).to.not.be.undefined;
    expect(sentence.clauseProperties({verb: 'be', subjectPronoun: 'i', tense: 'present'})).to.have.property('verb');
    expect(sentence.clauseProperties({verb: 'be', subjectPronoun: 'i', tense: 'present'})).to.have.property('prefix');
    expect(sentence.clauseProperties({verb: 'be', subjectPronoun: 'i', tense: 'present'})).to.have.property('suffix');
    expect(sentence.clauseProperties({verb: 'be', subjectPronoun: 'i', tense: 'present'})).to.have.property('break');
    expect(sentence.clauseProperties({verb: 'be', subjectPronoun: 'i', tense: 'present'})).to.have.property('beforeAdverb');
    expect(sentence.clauseProperties({verb: 'be', subjectPronoun: 'i', tense: 'present'})).to.have.property('afterAdverb');
    expect(sentence.clauseProperties({verb: 'be', subjectPronoun: 'i', tense: 'present'})).to.have.property('adjunctBefore');
    expect(sentence.clauseProperties({verb: 'be', subjectPronoun: 'i', tense: 'present'})).to.have.property('adjunctMiddle');
    expect(sentence.clauseProperties({verb: 'be', subjectPronoun: 'i', tense: 'present'})).to.have.property('adjunctAfter');
    expect(sentence.clauseProperties({verb: 'be', subjectPronoun: 'i', tense: 'present'})).to.have.property('conjunctionBefore');
    expect(sentence.clauseProperties({verb: 'be', subjectPronoun: 'i', tense: 'present'})).to.have.property('conjunctionAfter');
  });

  it('clause should return a sentence object with the correct properties', () => {
    expect(sentence.clause({subject: 'i', verb: 'be', subjectPronoun: 'i', tense: 'present'})).to.be.an('object');
    expect(sentence.clause({subject: 'i', verb: 'be', subjectPronoun: 'i', tense: 'present'})).to.not.be.undefined;
    expect(sentence.clause({subject: 'i', verb: 'be', subjectPronoun: 'i', tense: 'present'})).to.have.property('verb');
    expect(sentence.clause({subject: 'i', verb: 'be', subjectPronoun: 'i', tense: 'present'})).to.have.property('prefix');
    expect(sentence.clause({subject: 'i', verb: 'be', subjectPronoun: 'i', tense: 'present'})).to.have.property('suffix');
    expect(sentence.clause({subject: 'i', verb: 'be', subjectPronoun: 'i', tense: 'present'})).to.have.property('break');
    expect(sentence.clause({subject: 'i', verb: 'be', subjectPronoun: 'i', tense: 'present'})).to.have.property('adverbBefore');
    expect(sentence.clause({subject: 'i', verb: 'be', subjectPronoun: 'i', tense: 'present'})).to.have.property('adverbAfter');
    expect(sentence.clause({subject: 'i', verb: 'be', subjectPronoun: 'i', tense: 'present'})).to.have.property('adjunctBefore');
    expect(sentence.clause({subject: 'i', verb: 'be', subjectPronoun: 'i', tense: 'present'})).to.have.property('adjunctMiddle');
    expect(sentence.clause({subject: 'i', verb: 'be', subjectPronoun: 'i', tense: 'present'})).to.have.property('adjunctAfter');
    expect(sentence.clause({subject: 'i', verb: 'be', subjectPronoun: 'i', tense: 'present'})).to.have.property('conjunctionBefore');
    expect(sentence.clause({subject: 'i', verb: 'be', subjectPronoun: 'i', tense: 'present'})).to.have.property('conjunctionAfter');
    expect(sentence.clause({subject: 'i', verb: 'be', subjectPronoun: 'i', tense: 'present'})).to.have.property('postVerb');
    expect(sentence.clause({subject: 'i', verb: 'be', subjectPronoun: 'i', tense: 'present'})).to.have.property('subject');
    expect(sentence.clause({subject: 'i', verb: 'be', subjectPronoun: 'i', tense: 'present'})).to.have.property('subjectPronoun');
    expect(sentence.clause({subject: 'i', verb: 'be', subjectPronoun: 'i', tense: 'present'})).to.have.property('object');
    expect(sentence.clause({subject: 'i', verb: 'be', subjectPronoun: 'i', tense: 'present'})).to.have.property('objectPronoun');
  });

  it('print should set current sentence string from sentence object properties', () => {
    sentence.init();
    expect(sentence.start().print(sentence.clause({subject: 'i', verb: 'be', complement: 'happy', subjectPronoun: 'i', tense: 'present', verbOptions: [0,0,0]}),false,false).stop().currentSentence).to.be.a('string');
    expect(sentence.start().print(sentence.clause({subject: 'i', verb: 'be', complement: 'happy', subjectPronoun: 'i', tense: 'present', verbOptions: [0,0,0]}),false,false).stop().currentSentence).to.not.be.undefined;
    expect(sentence.start().print(sentence.clause({subject: 'i', verb: 'be', complement: 'happy', subjectPronoun: 'i', tense: 'present', verbOptions: [0,0,0]}),false,false).stop().currentSentence).to.equal('I am happy.');
    expect(sentence.start().print(sentence.clause({subject: 'i', verb: 'be', complement: 'happy', subjectPronoun: 'i', tense: 'present', verbOptions: [1,0,0]}),false,false).stop().currentSentence).to.equal('I am not happy.');
    expect(sentence.start().print(sentence.clause({subject: 'i', verb: 'be', complement: 'happy', subjectPronoun: 'i', tense: 'present', verbOptions: [0,1,0]}),false,false).stop().currentSentence).to.equal('I am being happy.');
    expect(sentence.start().print(sentence.clause({subject: 'i', verb: 'be', complement: 'happy', subjectPronoun: 'i', tense: 'present', verbOptions: [0,0,1]}),false,false).stop().currentSentence).to.equal('I have been happy.');
    expect(sentence.start().print(sentence.clause({subject: 'i', verb: 'be', complement: 'happy', subjectPronoun: 'i', tense: 'present', verbOptions: [1,1,0]}),false,false).stop().currentSentence).to.equal('I am not being happy.');
    expect(sentence.start().print(sentence.clause({subject: 'i', verb: 'be', complement: 'happy', subjectPronoun: 'i', tense: 'present', verbOptions: [1,1,1]}),false,false).stop().currentSentence).to.equal('I haven\'t been being happy.');
    expect(sentence.start().print(sentence.clause({subject: 'bob', verb: 'be', complement: 'happy', subjectPronoun: 'he', tense: 'present', verbOptions: [0,0,0]}),false,false).stop().currentSentence).to.equal('Bob is happy.');
    expect(sentence.start().print(sentence.clause({subject: 'bob', verb: 'be', complement: 'happy', subjectPronoun: 'he', tense: 'present', verbOptions: [0,0,0]}),0,0,1).stop().currentSentence).to.equal('Is happy.');
    expect(sentence.start().print(sentence.clause({subject: 'bob', verb: 'be', complement: 'happy', subjectPronoun: 'he', tense: 'present', verbOptions: [0,0,0]}),0,0,0,1).stop().currentSentence).to.equal('Happy.');
  });

  it('capitals should return a capitalized version of a string and throw error if not a string', () => {
    expect(sentence.capitals).to.throw();
    expect(sentence.capitals('a')).to.equal('A');
    expect(sentence.capitals('apples')).to.equal('Apples');
  });

  it('match should correctly recognize sentence match cases', () => {
    expect(sentence.match({subject:'John', object: 'Bob', verb: 'be'},{subject:'John', object: 'Bob', verb: 'have'})).to.equal('subject-object');
    expect(sentence.match({subject:'John', object: 'Bob', verb: 'be'},{subject:'John', object: 'Sam', verb: 'have'})).to.equal('subject');
    expect(sentence.match({subject:'Sam', object: 'Bob', verb: 'be'},{subject:'John', object: 'Bob', verb: 'have'})).to.equal('object');
    expect(sentence.match({subject:'John', object: 'Sam', verb: 'be'},{subject:'John', object: 'Bob', verb: 'be'})).to.equal('subject-verb');
  });

  it('paragraph should correctly join a group of sentences', () => {
    sentence.init();
    expect(sentence.paragraph([sentence.clause({subject: 'i', verb: 'be', subjectPronoun: 'i', tense: 'present'}),sentence.clause({subject: 'i', verb: 'be', subjectPronoun: 'i', tense: 'present'})]).currentParagraph).to.not.equal('');
    sentence.init();
    expect(sentence.paragraph([sentence.clause({subject: 'i', verb: 'be', subjectPronoun: 'i', tense: 'present'}),sentence.clause({subject: 'i', verb: 'be', subjectPronoun: 'i', tense: 'present'})]).currentParagraphArray).to.not.deep.equal([]);
    sentence.init();
    expect(sentence.paragraph([sentence.clause({subject: 'i', verb: 'be', subjectPronoun: 'i', tense: 'present'}),sentence.clause({subject: 'i', verb: 'be', subjectPronoun: 'i', tense: 'present'})]).currentParagraphArray.length).to.equal(2);
    expect(()=>{sentence.paragraph()}).to.throw();
  });

  it('add with tag should add clause object to tags to print with correct array name', () => {
    sentence.init();
    sentence.addWithTag('intro',{subject: 'i', verb: 'be', subjectPronoun: 'i', tense: 'present'});
    expect(sentence.tagsToPrint).to.have.property('intro');
    expect(sentence.tagsToPrint.intro).to.be.an('array');
    expect(sentence.tagsToPrint.intro.length).to.equal(1);
    expect(sentence.tagsToPrint.intro[0]).to.be.an('object');
  });

  it('add with tag from path should add clause object to tags to print with correct array name', () => {
    sentence.init();
    sentence.addWithTagFromPath('intro','test/test-sentence');
    expect(sentence.tagsToPrint).to.have.property('intro');
    expect(sentence.tagsToPrint.intro).to.be.an('array');
    expect(sentence.tagsToPrint.intro.length).to.equal(1);
    expect(sentence.tagsToPrint.intro[0]).to.be.an('object');
    sentence.printFromTags();
    expect(sentence.currentParagraph).to.equal('Bill is happy.');
  });

  it('print from tags should correctly iterate over tag object and add to paragraph', () => {
    sentence.init();
    sentence.addWithTag('1',{subject: 'i', verb: 'be', complement: 'happy', subjectPronoun: 'i', tense: 'present'});
    sentence.addWithTag('2',{subject: 'Bob', verb: 'be', complement: 'happy', subjectPronoun: 'he', tense: 'present'});
    sentence.printFromTags();
    expect(sentence.currentParagraph).to.equal('I am happy.Bob is happy.');
    expect(sentence.currentParagraphArray.length).to.equal(2);
  });

  it('source should parse url string with correctly extracted text', (done) => {
    sentence.init();
    let url = 'http://google.com';
    try {
      sentence.sourceFromUrl(url,'<body>','</body>');
      done();
    }
    catch (error) {
      done(error);
    }
    expect(sentence.source).to.equal('<BODY><H1>302 Moved</H1>The document has moved<A HREF="http://www.google.com.au/?gfe_rd=cr&amp;dcr=0&amp;ei=RSb_WcHhIcnr8AeDzbpY">here</A>.</BODY>');
  });

  it('source contains should correctly find search terms', () => {
    sentence.init();
    sentence.source = '<content>I like to eat cheese</content>';
    expect(sentence.sourceContains(['cheese'])).to.equal(true);
    expect(sentence.sourceContains(['donuts'])).to.equal(false);
    expect(sentence.sourceContains(['cheese','like','i'])).to.equal(true);
    expect(sentence.sourceContains(['chees'])).to.equal(false);
  });

  it('source replace should correctly find search terms and replace', () => {
    sentence.init();
    sentence.currentParagraph = 'I like to eat {{food}} and {{food}} is tasty.';
    sentence.currentParagraphArray = ['I like to eat {{food}} and','{{food}} is tasty.'];
    expect(sentence.sourceReplace(/{{food}}/g,/<h1 class="title">\w+<\/h1>/i,'<h1 class="title">cheese</h1>')).to.equal(true);
    expect(sentence.sourceReplace(/{{name}}/g,/<h1 class="title">\w+<\/h1>/i,'<h1 class="title">cheese</h1>')).to.equal(false);
    expect(sentence.currentParagraph).to.equal('I like to eat cheese and cheese is tasty.');
    expect(sentence.currentParagraphArray[0]).to.equal('I like to eat cheese and');
    expect(sentence.currentParagraphArray[1]).to.equal('cheese is tasty.');
  });

  it('out should return correct string of joined paragraph array', () => {
    sentence.init();
    sentence.currentParagraphArray = ['I like to eat cheese and','cheese is tasty.'];
    expect(sentence.out().string).to.equal('I like to eat cheese and cheese is tasty.');
    expect(sentence.out().array).to.deep.equal(sentence.currentParagraphArray);
    expect(()=>{sentence.init();sentence.out();}).to.throw();
  });

  it('example sentence should correctly output sentences', () => {
    sentence.init();
    let result = eg();
    expect(result.string).to.equal('Bill is joyous.');
  });

});
