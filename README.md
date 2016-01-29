# word-filter
[![version](https://img.shields.io/npm/v/word-filter.svg)](https://www.npmjs.org/package/word-filter)
[![status](https://travis-ci.org/zoubin/word-filter.svg?branch=master)](https://travis-ci.org/zoubin/word-filter)

Extract words from the input stream into another text stream.

## Command line
```bash
npm i -g word-filter

wf -h

wf -n example/text
cat example/text | wf -n

```

## API

```js
const WordFilter = require('word-filter')

const fs = require('fs')

fs.createReadStream(__dirname + '/text')
  .pipe(WordFilter.ascii())
  .on('data', word => console.log(word))

```

**Input**
```
Don't repeat yourself.
笑相遇，似觉琼枝玉树相倚，暖日明霞光烂。
Do one thing and do it well.
在Node stream暴露的接口中，Readable和Writable分别需要实现_read和_write方法。

```

**Output**
```
Don
t
repeat
yourself
Do
one
thing
and
do
it
well
Node
stream
Readable
Writable
_read
_write

```

