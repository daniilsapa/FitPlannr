import React from 'react';
import { Button, Divider, Space } from 'antd';

import { I18nMessage } from '../../shared/ui/i18n';
import { useAppSelector, useAppDispatch } from '../../app/hooks';

import {
	increment,
	decrement,
	incrementByAmount,
	incrementAsync,
	selectCount,
} from '../../entities/counter';

// ---

function MainPage() {
	const count = useAppSelector(selectCount);
	const dispatch = useAppDispatch();

	return (
		<header className="app-header">
			<p>
				<I18nMessage id="edit" value={{ path: <code>src/App.tsx</code> }} />
			</p>
			<a
				className="app-link"
				href="https://reactjs.org"
				target="_blank"
				rel="noopener noreferrer"
			>
				<I18nMessage id="learn" />
			</a>
			<Divider />
			<Space>
				<Button onClick={() => dispatch(increment())}>+</Button>
				<span>{count}</span>
				<Button onClick={() => dispatch(decrement())}>-</Button>
				<Divider />
				<Button onClick={() => dispatch(incrementByAmount(5))}>
					Increment by 5
				</Button>
				<Button type="ghost" onClick={() => dispatch(incrementAsync(1))}>
					Increment in 1 second
				</Button>
			</Space>
		</header>
	);
}

export default MainPage;
