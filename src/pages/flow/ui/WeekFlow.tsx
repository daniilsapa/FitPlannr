import React from 'react';
import { Button, Empty } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

import { Week } from '../../../entities/workout/model';
import { I18nMessage } from '../../../shared/ui/i18n';

// ---

interface WeekViewProps {
	week: Week;
	weekIndex: number;
	workoutTitle: string;
	onChooseDay: (weekIndex: number, dayIndex: number) => void;
	onBack: () => void;
}

export default function WeekFlow({
	week,
	weekIndex,
	workoutTitle,
	onChooseDay,
	onBack,
}: WeekViewProps) {
	return (
		<div>
			<div
				style={{
					display: 'flex',
				}}
			>
				<Button type="text" onClick={() => onBack()}>
					<LeftOutlined />{' '}
					<I18nMessage id="Common.backTo" value={{ what: workoutTitle }} />
				</Button>
				<h2
					style={{
						marginTop: '3px',
						marginLeft: '3em',
						marginBottom: 0,
					}}
				>
					{week.weekTitle}
				</h2>
			</div>

			{week.days.length === 0 && (
				<Empty
					style={{ paddingTop: '3em', paddingBottom: '3em' }}
					description="No days in this week yet."
				/>
			)}

			<ol
				style={{
					listStyle: 'none',
				}}
			>
				{week.days.map((day, index) => (
					<li key={day.dayTitle}>
						<Button type="text" onClick={() => onChooseDay(weekIndex, index)}>
							{day.dayTitle} <RightOutlined />
						</Button>
					</li>
				))}
			</ol>
		</div>
	);
}
