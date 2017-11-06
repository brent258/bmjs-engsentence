const sentence = require('./index.js');
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
};
