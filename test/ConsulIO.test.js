'use strict';

const fs = require('fs');

const ConsulHelper = require('./ConsulHelper');
const ConsulIO = require('../lib/ConsulIO');

/* eslint-disable no-sync */
/* eslint-disable no-new */
describe('ConsulIO', () => {
  it('must be a class', async () => {
    expect(typeof ConsulIO).toStrictEqual('function');
  });

  describe('constructor', () => {
    it('must throw an exception if options is missing', async () => {
      let error;
      try {
        new ConsulIO();
      } catch (e) {
        error = e;
      }
      expect(error.message).toStrictEqual('Options are missing.');
    });

    it('must throw an exception if options.consulUrl is missing', async () => {
      let error;
      try {
        new ConsulIO({});
      } catch (e) {
        error = e;
      }
      expect(error.message).toStrictEqual('consulUrl is missing.');
    });
  });

  describe('key2file', () => {
    let cio;
    const testfile = './testfile';
    const testpath = 'dc1/home/env/test/path';
    const urlSuffix = 'v1/kv';

    beforeAll(async () => {
      const consulUrl = 'https://localhost:8500';
      const options = { consulUrl };
      const consulHelper = new ConsulHelper(options);

      const fileExists = fs.existsSync(testfile);
      if (fileExists) {
        fs.unlinkSync(testfile);
      }

      await consulHelper.putConfig(`${urlSuffix}/${testpath}`, 'testkey', 'testvalue');

      cio = new ConsulIO(options);
    });

    it('must be a function', async () => {
      expect(typeof cio.key2file).toStrictEqual('function');
    });

    it('must get specified value from given key and path and write it to given file', async () => {
      expect(fs.existsSync(testfile)).toBeFalsy();
      await (async () => {
        return expect(cio.key2file(testpath, 'testkey', testfile)).resolves.toEqual(undefined);
      })();
      expect(fs.existsSync(testfile)).toBeTruthy();
      expect(fs.readFileSync(testfile).toString()).toStrictEqual('testvalue');
    });
  });
});
