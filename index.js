'use strict';
const detectIndent = require('detect-indent');
const hjson = require('hjson').rt;

const merge = (template, config) => {
	for (const key in template) {
		if (config[key]) {
			const templateValue = template[key];
			const configValue = config[key];

			if (typeof templateValue !== typeof configValue) {
				continue;
			}

			if (typeof configValue === 'object') {
				template[key] = merge(template[key], configValue);
			} else {
				template[key] = configValue;
			}
		}
	}

	return template;
};

module.exports = (template, config) => {
	if (typeof template !== 'string') {
		throw new TypeError(`Expected \`template\` to be of type \`string\`, got \`${typeof template}\``);
	}

	if (typeof config !== 'string') {
		throw new TypeError(`Expected \`config\` to be of type \`string\`, got \`${typeof config}\``);
	}

	const indent = detectIndent(template).indent;

	template = hjson.parse(template);
	config = hjson.parse(config);

	const ret = merge(template, config);

	return hjson.stringify(ret, {
		space: indent,
		separator: true,
		bracesSameLine: true,
		quotes: 'all'
	});
};
