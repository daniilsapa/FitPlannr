import React from 'react';
import { FormattedMessage } from 'react-intl';

// ---

interface MessageProps {
	id: string;
	value?: Record<string, React.ReactNode>;
}

function Message({ id, value }: MessageProps) {
	return <FormattedMessage id={id} values={{ ...value }} />;
}

Message.defaultProps = {
	value: {},
};

export default Message;
