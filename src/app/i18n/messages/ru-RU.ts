import locales from '../locales';

import categoryMessages from '../../../entities/category/i18n/messages/ru-RU';
import clientMessages from '../../../entities/client/i18n/messages/ru-RU';
import exerciseMessages from '../../../entities/exercise/i18n/messages/ru-RU';
import userMessages from '../../../entities/user/i18n/messages/ru-RU';
import workoutMessages from '../../../entities/workout/i18n/messages/ru-RU';

// ---

export default {
	[locales.RUSSIAN]: {
		learn: 'Учим React',
		edit: 'Отредактируйте {path} и сохраните для перезагрузки.',
		...categoryMessages,
		...clientMessages,
		...exerciseMessages,
		...userMessages,
		...workoutMessages,
	},
};
