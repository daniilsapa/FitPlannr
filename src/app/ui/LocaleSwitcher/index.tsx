import React from 'react';
import { Image, Select } from 'antd';
import { locales } from '../../i18n';
import ukrainianFlag from '../../ua-locale.jpg';
import greatBritainFlag from '../../en-locale.jpg';
import russianFlag from '../../ru-locale.jpg';

// ---

interface LocaleSwitcherProps {
	locale: string;
	onChangeLocale: (locale: string) => void;
}

export default function LocaleSwitcher({
	locale,
	onChangeLocale,
}: LocaleSwitcherProps) {
	return (
		<Select
			onChange={onChangeLocale}
			defaultValue={locale}
			style={{ width: '12em' }}
		>
			<Select.Option value={locales.UKRAINIAN}>
				<div className="locale-wrapper">
					<Image
						alt="Ukrainian flag"
						width="2em"
						preview={false}
						src={ukrainianFlag}
					/>
					<div className="locale-wrapper-text">Українська</div>
				</div>
			</Select.Option>

			<Select.Option value={locales.ENGLISH}>
				<div className="locale-wrapper">
					<Image
						alt="Flag of Great Britain"
						width="2em"
						preview={false}
						src={greatBritainFlag}
					/>
					<div className="locale-wrapper-text">English</div>
				</div>
			</Select.Option>

			<Select.Option value={locales.RUSSIAN}>
				<div className="locale-wrapper">
					<Image
						alt="Flag of opposition to the 2022 Russian invasion of Ukraine"
						width="2em"
						preview={false}
						src={russianFlag}
					/>
					<div className="locale-wrapper-text">Русский</div>
				</div>
			</Select.Option>
		</Select>
	);
}
