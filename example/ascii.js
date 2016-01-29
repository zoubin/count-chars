const WordFilter = require('..')

const fs = require('fs')

fs.createReadStream(__dirname + '/text')
  .pipe(WordFilter.ascii())
  .on('data', word => console.log(word))
