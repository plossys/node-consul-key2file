'use strict';

const fs = require('fs');

const ConsulHelper = require('./ConsulHelper');
const ConsulIO = require('../lib/ConsulIO');

jest.setTimeout(30000);

/* eslint-disable no-sync */
/* eslint-disable no-new */
describe('ConsulIO', () => {
  let cio;
  const testfile = './testfile';
  const testpath = 'dc1/home/env/test/path';
  const urlSuffix = 'v1/kv';
  const consulUrl = 'https://localhost:8500';
  const options = { consulUrl };

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
    beforeAll(async () => {
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

  describe('getValue', () => {
    beforeAll(async () => {
      const consulHelper = new ConsulHelper(options);

      await consulHelper.putConfig(`${urlSuffix}/${testpath}`, 'testkey', 'testvalue');

      cio = new ConsulIO(options);
    });

    it('must be a function', async () => {
      expect(typeof cio.getValue).toStrictEqual('function');
    });

    it('must get specified value from given key and path and write it to given file', async () => {
      await (async () => {
        return expect(cio.getValue(testpath, 'testkey')).resolves.toEqual('testvalue');
      })();
    });
  });

  describe('setValue', () => {
    beforeAll(async () => {
      const consulHelper = new ConsulHelper(options);

      await consulHelper.putConfig(`${urlSuffix}/${testpath}`, 'testkey', '');

      cio = new ConsulIO(options);
    });

    it('must be a function', async () => {
      expect(typeof cio.setValue).toStrictEqual('function');
    });

    it('must set specified value to the given key', async () => {
      await (async () => {
        return expect(cio.setValue(testpath, 'testkey', 'testvalue')).resolves.toEqual(undefined);
      })();
    });
  });

  describe('file2key', () => {
    beforeAll(async () => {
      const consulHelper = new ConsulHelper(options);

      await consulHelper.putConfig(`${urlSuffix}/${testpath}`, 'testkey', '');
      fs.writeFileSync(testfile, 'testvalue');
      cio = new ConsulIO(options);
    });

    it('must be a function', async () => {
      expect(typeof cio.file2key).toStrictEqual('function');
    });

    it('must set content of file to the given key', async () => {
      await (async () => {
        return expect(cio.file2key(testpath, 'testkey', testfile)).resolves.toEqual(undefined);
      })();
      expect(cio.getValue(testpath, 'testkey')).resolves.toEqual('testvalue');
    });
  });
});
