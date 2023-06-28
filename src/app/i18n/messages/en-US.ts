import locales from '../locales';
import userMessages from '../../../entities/user/i18n/messages/en-US';

// ---

export default {
	[locales.ENGLISH]: {
		learn: 'Learn React',
		edit: 'Edit {path} and save to reload.',
		...userMessages,
	},
};
