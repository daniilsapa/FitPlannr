import locales from '../locales';

import categoryMessages from '../../../entities/category/i18n/messages/en-US';
import clientMessages from '../../../entities/client/i18n/messages/en-US';
import exerciseMessages from '../../../entities/exercise/i18n/messages/en-US';
import userMessages from '../../../entities/user/i18n/messages/en-US';
import workoutMessages from '../../../entities/workout/i18n/messages/en-US';

import commonMessages from '../../../shared/i18n/messages/en-US';

// ---

export default {
	[locales.ENGLISH]: {
		...categoryMessages,
		...clientMessages,
		...exerciseMessages,
		...userMessages,
		...workoutMessages,
		...commonMessages,
	},
};
