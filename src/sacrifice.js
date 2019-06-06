const fs = require('fs');
const Log = require('./log.js');

function Sacrifice(pathToFile) {
  let extracted = {};
  let enumerations = [ "title", "style", "head", "script", "body"];
  function sliceWithRegex(memRef, type) {
    let openIndex = null;
    let closeIndex = null;
    const tagExpOpen  = `<${type}`;
    const tagExpClose = `</${type}>`;
    const sampleSet = memRef.payload.join('')
    const tagRegexOpen  = new RegExp(tagExpOpen ).exec(sampleSet);
    const tagRegexClose = new RegExp(tagExpClose).exec(sampleSet);

    if (tagRegexOpen) openIndex = tagRegexOpen.index;
    if (tagRegexClose) closeIndex = tagRegexClose.index + type.length + 3;
    if (typeof openIndex == 'number' && typeof closeIndex == 'number') {
      const sampleDecomposition = memRef.payload
        .splice(openIndex, closeIndex - openIndex)
        .slice(type.length + 2, -(type.length + 3));

      memRef[type] = sampleDecomposition.join('');
    } else {
      console.log(`Unable to find a complete entry for ${type}.`);
    };
  };
  const sourceFile = ('' + fs.readFileSync(pathToFile));
  extracted.payload = [...sourceFile];
  enumerations.forEach((label) => sliceWithRegex(extracted, label));
  extracted.payload = sourceFile;
  Log(`Sacrificed ${pathToFile}`, 'green');
  return extracted;
};

module.exports = Sacrifice;
