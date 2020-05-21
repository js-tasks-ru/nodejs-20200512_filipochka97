const stream = require('stream');
const os = require('os');

const isLastElementInArray = (array, index) => array.length - 1 === index;
const isEmptyPhrase = (phrase) => !phrase;

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.encoding = options.encoding || 'utf-8';
    this.unhandledPhrase = '';
  }

  _transform(chunk, encoding, callback) {
    (this.unhandledPhrase + chunk.toString(this.encoding))
        .split(os.EOL)
        .forEach((phrase, index, array) => {
          if (isLastElementInArray(array, index) && !isEmptyPhrase(phrase)) {
            this.unhandledPhrase = phrase;
          } else {
            this.push(phrase);
          }
        });

    callback();
  }

  _flush(callback) {
    this.push(this.unhandledPhrase);
    callback();
  }
}

module.exports = LineSplitStream;

