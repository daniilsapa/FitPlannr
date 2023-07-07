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
} from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
	deleteExercise,
	selectAllExercises,
} from '../../entities/exercise/lib/exercise-slice';

// ---

const { Search } = Input;

interface ExerciseSearchProps {
	onSearch: (value: string) => void;
}

function ExerciseSearch({ onSearch }: ExerciseSearchProps) {
	const navigate = useNavigate();
	return (
		<Space.Compact block size="large">
			<Search
				placeholder="Start typing to search..."
				allowClear
				size="large"
				onSearch={onSearch}
			/>
			<Button onClick={() => navigate('/exercise')}>
				<PlusOutlined />
			</Button>
		</Space.Compact>
	);
}

export default function ExercisesPage() {
	const exercises = useAppSelector(selectAllExercises);
	const dispatch = useAppDispatch();
	const [filterQuery, setFilterQuery] = useState('');
	const filteredData = exercises
		.map(({ _id, ...rest }) => ({ ...rest, id: _id }))
		.filter((item) =>
			item.name.toLowerCase().includes(filterQuery.toLowerCase())
		);

	const text = 'Are you sure to delete this task?';
	const description = 'Delete the task';

	return (
		<Row>
			<Col span={8} offset={8}>
				<ExerciseSearch onSearch={setFilterQuery} />
				<Divider />
				<List
					size="small"
					bordered
					dataSource={filteredData}
					renderItem={(item) => (
						<List.Item key={item.id}>
							{item.name}
							<div>
								<Link to={`/exercise/${item.id}`}>
									<Button type="text">
										<EditOutlined />
									</Button>
								</Link>
								<Popconfirm
									placement="topRight"
									title={text}
									description={description}
									onConfirm={() => dispatch(deleteExercise(item.id))}
									okText="Yes"
									cancelText="No"
								>
									<Button type="text">
										<DeleteOutlined
											style={{ color: theme.defaultConfig.token.colorError }}
										/>
									</Button>
								</Popconfirm>
							</div>
						</List.Item>
					)}
				/>
			</Col>
		</Row>
	);
}
