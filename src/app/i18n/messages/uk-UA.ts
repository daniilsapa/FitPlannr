import locales from '../locales';

import categoryMessages from '../../../entities/category/i18n/messages/uk-UA';
import clientMessages from '../../../entities/client/i18n/messages/uk-UA';
import exerciseMessages from '../../../entities/exercise/i18n/messages/uk-UA';
import userMessages from '../../../entities/user/i18n/messages/uk-UA';
import workoutMessages from '../../../entities/workout/i18n/messages/uk-UA';

import commonMessages from '../../../shared/i18n/messages/uk-UA';

// ---

export default {
	[locales.UKRAINIAN]: {
		'App.pageIsUnderConstruction': 'Ця сторінка знаходиться в розробці',
		'App.screenIsTooSmallDescription':
			'Вибачте, ця сторінка ще не оптимізована для вашого розміру екрану 😞. Будь ласка, використовуйте більший екран...',
		...categoryMessages,
		...clientMessages,
		...exerciseMessages,
		...userMessages,
		...workoutMessages,
		...commonMessages,
	},
};
