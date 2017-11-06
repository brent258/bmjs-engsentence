# bmjs-engsentence
An English utility for randomly generating printed paragraphs from given sentence data, with methods for extracting or replacing data from URL sources.

```javascript
const sentence = require('bmjs-engsentence');
```
Use object literals or external JSON files for sentence data:

```json
{
  "sentenceObj": {
    "subject": ["Bill"],
    "subjectPronoun": "he",
    "verb": ["be"],
    "verbOptions": [0,0,0],
    "tense": "present",
    "complement": ["happy"],
    "object": [""],
    "objectPronoun": "it",
    "passive": [""],
    "adverbBefore": [""],
    "adverbAfter": [""],
    "adjunctBefore": [""],
    "adjunctMoveable": [""],
    "adjunctAfter": [""],
    "adjunctRequired": false,
    "conjunctionBefore": [""],
    "conjunctionMoveable": [""],
    "conjunctionAfter": [""]
  },
  "pathOne": "",
  "keywordOne": "",
  "pathTwo": "",
  "keywordTwo": ""
}
```
Add sentences with optional tags for grouping, then generate a string and output:

```javascript
const sentence = require('bmjs-engsentence');
const rand = require('bmjs-random');

module.exports = function(url) {
  sentence.init();
  let paths, index, randomlyAdd;
  // Settings for sentence to add
  if (url) {
    sentence.sourceFromUrl(url);
  }
  paths = ['test/test-sentence'];
  index = Math.floor(Math.random() * paths.length);
  randomlyAdd = rand(true);
  if (paths.length >= index && randomlyAdd && (sentence.sourceContains(['search','terms']) || !url)) {
    sentence.addWithTagFromPath('tag',paths[index]);
  }
  paths.splice(index,1);
  // Print when all tags added
  sentence.printFromTags();
  // Replace keywords from sources
  sentence.sourceReplace(/happy/,/<source>\w+<\/source>/,'<source>joyous</source>');
  // Output sentences
  return sentence.out();
  // returns 'Bill is joyous.'
};
```
