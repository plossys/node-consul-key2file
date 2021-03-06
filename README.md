# @sealsystems/consul-key2file

[![CircleCI](https://circleci.com/gh/plossys/node-consul-key2file/tree/master.svg?style=svg)](https://circleci.com/gh/plossys/node-consul-key2file/tree/master)
<!-- [![AppVeyor](https://ci.appveyor.com/api/projects/status/9b2db9vds6i2msoy/branch/master?svg=true)](https://ci.appveyor.com/project/Plossys/node-consul/branch/master) -->

@sealsystems/consul-key2file provides support of reading values from consul and writes it to file.

## Installation

```bash
npm install @sealsystems/consul-key2file
```

## Quick start

First you need to add a reference to @sealsystems/consul-key2file within your application.

```javascript
const ConsulIO = require('@sealsystems/consul-key2file');

const consulIO = new ConsulIO({ consulUrl: 'http://localhost:8500'});

// Sets a value
await consulIO.setValue('dc1/home/env/test/path', 'testkey', 'testvalue');

// Gets a value
const value = await consulIO.getValue('dc1/home/env/test/path', 'testkey'); // returns 'testvalue'

// Writes a value to file
await consulIO.key2file('dc1/home/env/test/path', 'testkey', './testfile');

// Reads the content of a file and writes it as value to a key
await consulIO.file2key('dc1/home/env/test/path', 'testkey', './testfile');
```

