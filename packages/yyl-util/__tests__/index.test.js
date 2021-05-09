const { TestScheduler } = require('jest')
const { forEach } = require('../')

test('usage test', () => {
  expect(forEach).not.toEqual(undefined)
})
