import locales from '../locales';
import userMessages from '../../../entities/user/i18n/messages/ru-RU';

// ---

export default {
	[locales.RUSSIAN]: {
		learn: 'Учим React',
		edit: 'Отредактируйте {path} и сохраните для перезагрузки.',
		...userMessages,
	},
};
