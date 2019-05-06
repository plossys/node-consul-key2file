'use strict';

describe('index.js', () => {
  it('must be an object', async () => {
    const consulHelper = require('./index');
    expect(consulHelper).to.BeAnObject();
  });
})