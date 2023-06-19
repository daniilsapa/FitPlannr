module.exports = {
	extends: [
		'stylelint-config-standard',
		'stylelint-config-rational-order',
		'stylelint-prettier/recommended',
	],
	plugins: ['stylelint-order', 'stylelint-scss'],
	rules: {
		// Additional rules
		"rule-empty-line-before": ["always", {
      except: ["first-nested"]
    }],
    'color-no-invalid-hex': true,
    'declaration-block-no-duplicate-properties': [true, {
			ignore: ["consecutive-duplicates-with-different-values"]
		}],
    'block-no-empty': true,
    'no-duplicate-at-import-rules': true,
    'no-duplicate-selectors': true,

    /* Disallow selectors of lower specificity, recheck after full refactoring */
    'no-descending-specificity': null,

		'color-named': 'never',
		'max-line-length': 80,
		indentation: null,
	},
};
