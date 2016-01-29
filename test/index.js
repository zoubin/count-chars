const test = require('tap').test
const WordFilter = require('..')

test('cjk', function(t) {
  const filter = WordFilter.cjk()

  filter.write('a')
  filter.write('我')
  filter.write('b')
  filter.write('你')
  filter.write('c')
  filter.write('他')
  filter.end()

  const words = []
  filter.on('data', word => words.push(word))
  filter.on('end', () => {
    t.same(words, ['我', '你', '他'])
    t.end()
  })
})

test('ascii', function(t) {
  const filter = WordFilter.ascii()

  filter.write('a')
  filter.write('我')
  filter.write('b')
  filter.write('你')
  filter.write('c')
  filter.write('他')
  filter.end()

  const words = []
  filter.on('data', word => words.push(word))
  filter.on('end', () => {
    t.same(words, ['a', 'b', 'c'])
    t.end()
  })
})
