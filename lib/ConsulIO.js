'use strict';

const fs = require('fs-extra');
const consul = require('@sealsystems/seal-consul');
const log = require('@sealsystems/log').getLogger();

class ConsulIO {
  constructor(options) {
    if (!options) {
      throw new Error('Options are missing.');
    }
    if (!options.consulUrl) {
      throw new Error('consulUrl is missing.');
    }
    if (!options.token) {
      options.token = '';
    }
    this.options = options;
    consul.initialize(options);
  }

  async getValue(path, key) {
    log.debug(`called getValue(${path}, ${key})`);
    return new Promise((resolve, reject) => {
      consul.agent.consul.kv.get(
        {
          token: this.options.token,
          key: `${path}/${key}`,
          buffer: true
        },
        (error, result) => {
          if (error) {
            throw new Error(`Retrieving configuration form Consul failed. err: ${error}`);
          }
          if (result) {
            const value = Buffer.from(result.Value, 'base64').toString('utf8');
            resolve(value);
          } else {
            reject(`"Can't get value from Consul"`);
          }
        }
      );
    });
  }

  async setValue(path, key, value) {
    log.debug(`called putValue(${path}, ${key}, ${value})`);
    return new Promise(async (resolve) => {
      consul.agent.consul.kv.set(
        {
          token: this.options.token,
          key: `${path}/${key}`,
          value,
          buffer: true
        },
        (error) => {
          if (error) {
            throw new Error(`Retrieving configuration form Consul failed. err: ${error}`);
          }
          resolve();
        }
      );
    });
  }

  async key2file(path, key, file) {
    log.debug(`called key2file(${path}, ${key}, ${file})`);
    return new Promise(async (resolve) => {
      const value = await this.getValue(path, key);
      fs.writeFile(file, value, (err) => {
        if (err) {
          throw err;
        }
        resolve();
      });
    });
  }

  async file2key(path, key, file) {
    log.debug(`called file2key(${path}, ${key}, ${file})`);
    return new Promise(async (resolve) => {
      fs.readFile(file, async (err, data) => {
        if (err) {
          throw err;
        }
        await this.setValue(path, key, data);
        resolve();
      });
    });
  }
}

module.exports = ConsulIO;
