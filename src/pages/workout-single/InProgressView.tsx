import React from 'react';
import { Button, Typography } from 'antd';
import { RightOutlined } from '@ant-design/icons';

import { Workout } from '../../entities/workout/model';

// ---

interface InProgressViewProps {
	workout: Workout;
}

const { Title } = Typography;

export default function InProgressView({ workout }: InProgressViewProps) {
	return (
		<div>
			<ol>
				{workout.plan.map(({ weekTitle }) => (
					<li key={weekTitle}>
						<Title level={2}>{weekTitle}</Title>
						<Button type="text">
							<RightOutlined />
						</Button>
					</li>
				))}
			</ol>
		</div>
	);
}
