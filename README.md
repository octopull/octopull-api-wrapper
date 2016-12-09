# Octopull API wrapper for Node.js

This is an API wrapper for https://octopull.us/api

## Installation

```bash
$ npm install octopull-api-wrapper
```

## Usage

```js
var Octopull = require('octopull-api-wrapper');
var client = new Octopull({ access_token: 'abc123' });

// Get the user associated to the access_token
client.user();
```
