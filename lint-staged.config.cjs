module.exports = {
	'src/*.(css|scss)': ['stylelint --fix', 'prettier --write'],
	'src/*.(js|jsx|ts|tsx)': ['eslint --fix', 'prettier --write'],
};
