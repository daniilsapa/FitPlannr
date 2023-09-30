import React, { useState } from 'react';
import {
	List,
	Input,
	Col,
	Row,
	Divider,
	Button,
	Space,
	theme,
	Popconfirm,
	Spin,
	Tag,
} from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
	deleteWorkout,
	selectAllWorkouts,
	selectIsLoading as selectWorkoutsAreLoading,
} from '../../entities/workout/lib/workout-slice';
import { Workout } from '../../entities/workout/model';
import {
	AddToFlowButton,
	flowColor,
	getWorkoutsInFlow,
	RemoveFromFlowButton,
} from '../../features/workout/flow';

// ---

const { Search } = Input;

interface WorkoutSearchProps {
	onSearch: (value: string) => void;
}

function WorkoutSearch({ onSearch }: WorkoutSearchProps) {
	const navigate = useNavigate();
	const intl = useIntl();

	return (
		<Space.Compact block size="large">
			<Search
				placeholder={intl.formatMessage({ id: 'Common.startTypingToSearch' })}
				allowClear
				size="large"
				onSearch={onSearch}
			/>
			<Button onClick={() => navigate('/workout')}>
				<PlusOutlined />
			</Button>
		</Space.Compact>
	);
}

export default function WorkoutsPage() {
	const loading = useAppSelector(selectWorkoutsAreLoading);
	const workouts = useAppSelector(selectAllWorkouts);
	const dispatch = useAppDispatch();
	const [filterQuery, setFilterQuery] = useState('');
	const filteredData = workouts.filter((item: Workout) =>
		item.title.toLowerCase().includes(filterQuery.toLowerCase())
	);
	const [workoutsInFlow, setWorkoutsInFlow] = useState(getWorkoutsInFlow());

	// TODO: Move to i18n messages
	const text = 'Are you sure to delete this task?';
	const description = 'Delete the task';

	return (
		<div style={{ margin: '2em 2em 0' }}>
			<Row>
				<Col
					xs={{ span: 24, offset: 0 }}
					sm={{ span: 16, offset: 4 }}
					md={{ span: 12, offset: 6 }}
					lg={{ span: 12, offset: 6 }}
					xl={{ span: 8, offset: 8 }}
				>
					<Spin spinning={loading}>
						<WorkoutSearch onSearch={setFilterQuery} />
						<Divider />
						<List
							size="small"
							bordered
							dataSource={filteredData}
							renderItem={(item: Workout) => {
								const isInFlow = workoutsInFlow.includes(item._id);

								return (
									<List.Item
										title={item.title}
										key={item._id}
										actions={[
											isInFlow ? (
												<RemoveFromFlowButton
													key="1"
													size="small"
													workoutId={item._id}
													concise
													onClick={() => setWorkoutsInFlow(getWorkoutsInFlow())}
												/>
											) : (
												<AddToFlowButton
													key="1"
													size="small"
													workoutId={item._id}
													concise
													onClick={() => setWorkoutsInFlow(getWorkoutsInFlow())}
												/>
											),
											<Link to={`/workout/${item._id}`} key="2">
												<Button size="small" type="text">
													<EditOutlined />
												</Button>
											</Link>,
											<Popconfirm
												key="3"
												placement="topRight"
												title={text}
												description={description}
												onConfirm={() => dispatch(deleteWorkout(item._id))}
												okText="Yes"
												cancelText="No"
											>
												<Button size="small" type="text">
													<DeleteOutlined
														style={{
															color: theme.defaultConfig.token.colorError,
														}}
													/>
												</Button>
											</Popconfirm>,
										]}
									>
										<List.Item.Meta
											title={
												<span>
													{isInFlow && <Tag color={flowColor}>F</Tag>}
													{item.title}
												</span>
											}
										/>
									</List.Item>
								);
							}}
						/>
					</Spin>
				</Col>
			</Row>
		</div>
	);
}
