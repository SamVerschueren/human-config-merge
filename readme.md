# human-config-merge [![Build Status](https://travis-ci.org/SamVerschueren/human-config-merge.svg?branch=master)](https://travis-ci.org/SamVerschueren/human-config-merge)

> Merge a config with a config template

This module allows developers of applications to define a template of a configuration object. At runtime, this template can then be merged with the user defined config object adding new or removing old properties.


## Install

```
$ npm install --save human-config-merge
```


## Usage

```js
const merge = require('human-config-merge');

// The config template
const template = `
{
	// Some unicorn
	"unicorn": "🌈",

	"git": {
		// Your GitHub username
		"username": "",

		// A GitHub API key
		"apiKey": ""
	}
}
`;

// The current config
const config = `
{
	// Some unicorn
	"unicorn": "🦄",

	"git": {
		// Your GitHub username
		"username": "SamVerschueren",

		// The old GitHub API key
		"key": "1234"
	}
}
`;

merge(template, config);
/*
{
	// Some unicorn
	"unicorn": "🦄",

	"git": {
		// Your GitHub username
		"username": "SamVerschueren",

		// A GitHub API key
		"apiKey": ""
	}
}
*/
```


## API

### merge(template, config)

#### template

Type: `string`

Template config string.

#### config

Type: `string`

Current config string.


## License

MIT © [Sam Verschueren](https://github.com/SamVerschueren)
