const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.currentSizeOfTransferredData = 0;
    this.encoding = options.encoding || 'utf-8';
    this.maxSizeOfTransferredData = options.limit;
  }

  _transform(chunk, encoding, callback) {
    const chunkSize = Buffer.byteLength(chunk, this.encoding);
    const nextSizeOfTransferredData = this.currentSizeOfTransferredData + chunkSize;

    if (nextSizeOfTransferredData <= this.maxSizeOfTransferredData) {
      this.currentSizeOfTransferredData = nextSizeOfTransferredData;
      callback(null, chunk);
    } else {
      callback(new LimitExceededError());
    }
  }
}

module.exports = LimitSizeStream;
