import React from 'react';
import { Button, Empty, Typography } from 'antd';
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

const { Title } = Typography;

export default function WeekFlow({
	week,
	weekIndex,
	workoutTitle,
	onChooseDay,
	onBack,
}: WeekViewProps) {
	return (
		<div>
			<div>
				<Button type="text" onClick={() => onBack()}>
					<LeftOutlined />{' '}
					<I18nMessage id="Common.backTo" value={{ what: workoutTitle }} />
				</Button>
			</div>

			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
				}}
			>
				<Title
					level={2}
					style={{
						marginTop: '1em',
						marginBottom: 0,
					}}
				>
					{week.weekTitle}
				</Title>
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
