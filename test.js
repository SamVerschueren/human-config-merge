import test from 'ava';
import redent from 'redent';
import m from './';

test('type errors', t => {
	t.throws(() => m({}), 'Expected `template` to be of type `string`, got `object`');
	t.throws(() => m('{"foo":"bar"}', 0), 'Expected `config` to be of type `string`, got `number`');
});

test('shallow objects', t => {
	t.is(m('{"foo": ""}', '{}'), '{\n"foo": ""\n}');
	t.is(m('{"foo": ""}', '{"foo": "bar"}'), '{\n"foo": "bar"\n}');
	t.is(m('{"foo": "", "unicorn": ""}', '{"foo": "bar"}'), '{\n"foo": "bar",\n"unicorn": ""\n}');
	t.is(m('{"foo": ""}', '{"foo":"bar","hello":"world"}'), '{\n"foo": "bar"\n}');
});

test('type mismatch', t => {
	t.is(m('{"foo": ""}', '{"foo": 5}'), '{\n"foo": ""\n}');
	t.is(m('{"foo": 0}', '{"foo": "bar"}'), '{\n"foo": 0\n}');
	t.is(m('{"foo": false}', '{"foo": "bar"}'), '{\n"foo": false\n}');
});

test('deep objects', t => {
	const template = redent(`
		{
			"foo": {
				"bar": ""
			},
			"unicorn": ""
		}
	`);

	const current = redent(`
		{
			"foo": {
				"bar": "hello world",
				"unicorn": "rainbow"
			}
		}
	`);

	t.is(m(template, current), [
		'{',
		'	"foo": {',
		'		"bar": "hello world"',
		'	},',
		'	"unicorn": ""',
		'}'
	].join('\n'));
});

test('deep object type mismatch', t => {
	const template = redent(`
		{
			"foo": {
				"bar": {
					"unicorn": ""
				}
			}
		}
	`);

	const current = redent(`
		{
			"foo": {
				"bar": "hello world",
				"unicorn": "rainbow"
			}
		}
	`);

	t.deepEqual(m(template, current), [
		'{',
		'	"foo": {',
		'		"bar": {',
		'			"unicorn": ""',
		'		}',
		'	}',
		'}'
	].join('\n'));
});

test('comments', t => {
	const template = redent(`
		{
			// This is a comment
			"foo": "bar"
		}
	`);

	const current = redent(`
		{
			"foo": "baz"
		}
	`);

	t.is(m(template, current), [
		'{',
		'	// This is a comment',
		'	"foo": "baz"',
		'}'
	].join('\n'));
});

test('detect indentation', t => {
	const template = redent(`
		{
		  // This is a comment
		  "foo": "bar"
		}
	`);

	const current = redent(`
		{
		  "foo": "baz"
		}
	`);

	t.is(m(template, current), [
		'{',
		'  // This is a comment',
		'  "foo": "baz"',
		'}'
	].join('\n'));
});
