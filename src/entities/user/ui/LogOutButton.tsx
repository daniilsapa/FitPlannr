import React from 'react';
import { Button } from 'antd';

import { signOutUser } from '../lib/userSlice';
// TODO: import from a higher architecture level is not allowed
import { useAppDispatch } from '../../../app/hooks';
import { I18nMessage } from '../../../shared/ui/i18n';

// ---

interface LogOutButtonProps {
	onLogOutSuccess?: () => void;
}

// TODO: Implement onLogOutFailure
export default function LogOutButton({ onLogOutSuccess }: LogOutButtonProps) {
	const dispatch = useAppDispatch();

	const handleClick = () => {
		dispatch(signOutUser()).unwrap().then(onLogOutSuccess);
	};

	return (
		<Button onClick={handleClick}>
			<I18nMessage id="User.signOut" />
		</Button>
	);
}

LogOutButton.defaultProps = {
	onLogOutSuccess: () => {},
};
