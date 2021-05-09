'use strict'

const { waitFor } = require('..')

describe('yyl-util.waitfor', () => {
  it('needs tests', async () => {
    const now = new Date()
    await waitFor(200)
    expect(new Date() - now >= 200).toEqual(true)
  })
})
