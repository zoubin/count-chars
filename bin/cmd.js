#!/usr/bin/env node

const stream = require('stream')
const Command = require('commander').Command
const WordFilter = require('..')
const fs = require('fs')

const program = new Command('chc')
program
  .version(require('../package').version)
  .option('-c, --charset <pattern>', 'Filter words according to word_pattern.', 'ascii')
  .option('--cjk', 'Filter CJK words.')
  .option('-n, --count', 'Show the number of words filtered.')
  .option('-P, --no-print', 'Prevent from printing the filter text.')
  .option('-d, --delimiter <str>', 'Delimiter for words when printed', ' ')
  .parse(process.argv)

createSource(program.args[0])
  .pipe(createFilter(program.cjk ? 'cjk' : program.charset))
  .pipe(stream.Transform({
    objectMode: true,
    transform: function (word, enc, next) {
      if (program.count) {
        this.count = this.count || 0
        ++this.count
        process.stdout.write('\r\x1b[K' + this.count)
      }
      if (!this._delimiter) {
        this._delimiter = makeDelimiter(program.delimiter)
      } else {
        this.push(this._delimiter)
      }
      next(null, word)
    },
  }))
  .pipe(createDest(program.print && !program.count))

function createFilter(charset) {
  charset = charset.toLowerCase()
  if (['cjk', 'ascii', 'unicode'].indexOf(charset) === -1) {
    const pat = new RegExp(charset)
    return new WordFilter(c => pat.test(c))
  }
  return WordFilter[charset]()
}

function createDest(print) {
  if (print) {
    return process.stdout
  }
  return stream.Writable({
    write: function (buf, enc, next) {
      next()
    },
  })
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

