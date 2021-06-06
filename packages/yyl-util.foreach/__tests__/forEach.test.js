'use strict'
const { forEach } = require('../output')

describe('forEach', () => {
  it('usage test', async () => {
    let count = 0
    await forEach([1, 2, 3], async (num) => {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(undefined)
        }, 200)
      })
      count = count + num
    })

    expect(count).toEqual(6)
  })

  it('return true test', async () => {
    let count = 0
    await forEach([1, 2, 3], async (num, index) => {
      await new Promise((resolve) => resolve(undefined))
      count = count + num
      if (index === 1) {
        return true
      }
    })
    expect(count).toEqual(3)
  })
})
