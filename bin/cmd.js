#!/usr/bin/env node

const Stream = require('stream')
const Transform = Stream.Transform
const PassThrough = Stream.PassThrough
const Command = require('commander').Command
const WordFilter = require('..')
const fs = require('fs')

const program = new Command('chc')
program
  .version(require('../package').version)
  .option('-c, --charset <pattern>', 'Filter words according to word_pattern. You can also specify a chaset: cjk, ascii (default)', 'ascii')
  .option('-n, --count', 'Show the number of words filtered.')
  .option('-P, --no-print', 'Prevent from printing the filter text.')
  .option('-d, --delimiter <str>', 'Delimiter for words when printed', ' ')
  .parse(process.argv)

function createFilter(charset) {
  charset = charset.toLowerCase()
  if (['cjk', 'ascii', 'unicode'].indexOf(charset) === -1) {
    const pat = new RegExp(regexp)
    return new WordFilter(c => pat.test(c))
  }
  return WordFilter[charset]()
}

function createDest(print) {
  return print ? process.stdout : PassThrough()
}

function createSource(file) {
  if (process.stdin.isTTY) {
    if (!file) {
      process.stderr.write('No file provided.')
      process.exit(-1)
    }
    return fs.createReadStream(file)
  }
  return process.stdin
}

function makeDelimiter(s) {
  return JSON.parse('"' + s.replace(/"/g, '\\"') + '"')
}

createSource(program.args[0])
  .pipe(createFilter(program.charset))
  .pipe(Transform({
    objectMode: true,
    transform: function (word, enc, next) {
      this.count = this.count || 0
      ++this.count
      if (!this._delimiter) {
        this._delimiter = makeDelimiter(program.delimiter)
      } else {
        this.push(this._delimiter)
      }
      next(null, word)
    },
    flush: function (next) {
      if (program.count) {
        console.log(this.count)
      }
    }
  }))
  .pipe(createDest(program.print && !program.count))

