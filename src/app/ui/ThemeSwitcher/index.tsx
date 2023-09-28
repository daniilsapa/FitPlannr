import { Switch } from 'antd';
import React from 'react';

// ---

interface ThemeSwitcherProps {
	theme: string;
	onThemeChange: (checked: boolean) => void;
}

export default function ThemeSwitcher({
	theme,
	onThemeChange,
}: ThemeSwitcherProps) {
	return (
		<Switch
			checkedChildren="🌙"
			unCheckedChildren="☀️"
			defaultChecked={theme === 'dark'}
			onChange={onThemeChange}
		/>
	);
}
