'use strict';

const consul = require('@sealsystems/seal-consul');
const url = require('url');
const request = require('request');

class ConsulHelper {
  constructor(options) {
    this.options = options;
    consul.initialize(options);
  }

  async putConfig(path, key, value) {
    const urlObject = url.parse(this.options.consulUrl);

    urlObject.pathname = `${path}/${key}`;
    const requestOptions = {
      url: url.format(urlObject),
      body: value
    };

    if (this.options.token) {
      requestOptions.headers = {
        'x-consul-token': this.options.token,
        timeout: 20000 // to wait until consul is up
      };
    }

    return new Promise((resolve) => {
      request.put(requestOptions, (err, res) => {
        if (err) {
          throw new Error(`Put ${key} to consul failed cause of: ${err}`);
        }
        switch (res.statusCode) {
          case 200:
            resolve();
            break;
          case 403:
            throw new Error(`Put ${key} to consul failed cause of "No valid token provided"`);
          case 500:
            throw new Error(`Put ${key} to consul failed cause of "Internal server error"`);
          default:
            throw new Error(`Put ${key} to consul failed cause of unexpected status code: ${res.statusCode}`);
        }
      });
    });
  }
}

module.exports = ConsulHelper;
