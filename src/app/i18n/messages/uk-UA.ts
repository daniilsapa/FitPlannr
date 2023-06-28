import locales from '../locales';
import userMessages from '../../../entities/user/i18n/messages/uk-UA';

// ---

export default {
	[locales.UKRAINIAN]: {
		learn: 'Вивчаємо React',
		edit: 'Відредагуйте {path} і збережіть для перезавантаження.',
		...userMessages,
	},
};
