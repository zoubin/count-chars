'use strict'

const Transform = require('stream').Transform
const StringDecoder = require('string_decoder').StringDecoder

class WordFilter extends Transform {
  constructor(isWordChar, isWordEnd) {
    super({ readableObjectMode: true })

    if (typeof isWordEnd !== 'function') {
      isWordEnd = () => false
    }

    this._isWordChar = isWordChar
    this._isWordEnd = isWordEnd
    this._word = ''

    this._decoder = new StringDecoder()
  }

  pushWord(str) {
    if (!str) return
    for (var c of str) {
      if (this._isWordChar(c)) {
        if (this._isWordEnd(this._word)) {
          this._pushWord()
        }
        this._word += c
      } else {
        this._pushWord()
      }
    }
  }

  _pushWord() {
    if (this._word) {
      this.push(this._word)
      this._word = ''
    }
  }

  _transform(buf, enc, next) {
    this.pushWord(this._decoder.write(buf))
    next()
  }

  _flush(next) {
    this.pushWord(this._decoder.end())
    this._pushWord()
    next()
  }

  static cjk() {
    return new WordFilter(charStr => {
      const code = charStr.charCodeAt(0)
      return code >= 0x4e00 && code <= 0x9fcc
    }, () => true)
  }

  static ascii() {
    return new WordFilter(c => /\w{1}/.test(c))
  }
}

module.exports = WordFilter

