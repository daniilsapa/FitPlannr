import React, { Fragment } from 'react';
import { IntlProvider } from 'react-intl';

import messages from './messages';

// ---

interface ProviderProps {
	children: React.ReactNode;
	locale: string;
}

function Provider({ children, locale }: ProviderProps) {
	return (
		<IntlProvider
			locale={locale}
			textComponent={Fragment}
			messages={messages[locale]}
		>
			{children}
		</IntlProvider>
	);
}

export default Provider;
