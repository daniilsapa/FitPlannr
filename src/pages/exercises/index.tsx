import React, { useState } from 'react';
import {
	List,
	Input,
	Col,
	Row,
	Divider,
	Tag,
	Button,
	Space,
	Spin,
	Popconfirm,
} from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';

import { useAppDispatch, useAppSelector } from '../../app/hooks';

// Entities
import {
	selectAllExercises,
	selectIsLoading as selectExercisesAreLoading,
	deleteExercise,
} from '../../entities/exercise/lib/exercise-slice';
import {
	selectCategoryEntities,
	selectIsLoading as selectCategoriesAreLoading,
} from '../../entities/category/lib/category-slice';
import { removeExerciseFromWorkouts } from '../../entities/workout/lib/workout-slice';

// UI
import { I18nMessage } from '../../shared/ui/i18n';

// ---

const { Search } = Input;

interface ExerciseSearchProps {
	onSearch: (value: string) => void;
}

function ExerciseSearch({ onSearch }: ExerciseSearchProps) {
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
			<Button onClick={() => navigate('/exercise')}>
				<PlusOutlined />
			</Button>
		</Space.Compact>
	);
}

export default function ExercisesPage() {
	const dispatch = useAppDispatch();

	const loading = useAppSelector(
		(state) =>
			selectExercisesAreLoading(state) || selectCategoriesAreLoading(state)
	);
	const categories = useAppSelector(selectCategoryEntities);
	const exercises = useAppSelector(selectAllExercises);
	const [filterQuery, setFilterQuery] = useState('');
	const filteredData = exercises
		.map(({ _id, ...rest }) => ({ ...rest, id: _id }))
		.filter((item) =>
			item.name.toLowerCase().includes(filterQuery.toLowerCase())
		);

	const handleRemove = (id: string) => {
		dispatch(deleteExercise(id))
			.unwrap()
			.then(() => {
				dispatch(removeExerciseFromWorkouts(id));
			});
	};

	return (
		<Row>
			<Col span={8} offset={8}>
				<Spin spinning={loading}>
					<ExerciseSearch onSearch={setFilterQuery} />
					<Divider />
					<List
						size="small"
						bordered
						dataSource={filteredData}
						renderItem={(item) => (
							<List.Item
								key={item.id}
								actions={[
									<Link key="1" to={`/exercise/${item.id}`}>
										<Button type="text">
											<EditOutlined />
										</Button>
									</Link>,
									<Popconfirm
										key="2"
										title={<I18nMessage id="Exercise.deleteExercise" />}
										description={
											<I18nMessage id="Exercise.deleteExerciseExplanation" />
										}
										placement="topRight"
										onConfirm={() => handleRemove(item.id)}
										okText={<I18nMessage id="Common.yes" />}
										cancelText={<I18nMessage id="Common.no" />}
										overlayStyle={{ width: '16em' }}
									>
										<Button type="text" danger>
											<DeleteOutlined />
										</Button>
									</Popconfirm>,
								]}
							>
								<span>{item.name}</span>

								<span>
									{item.categories.map((categoryId) =>
										typeof categories[categoryId] !== 'undefined' ? (
											<Tag
												key={categoryId}
												color={categories[categoryId]?.color}
											>
												{categories[categoryId]?.name}
											</Tag>
										) : null
									)}
								</span>
							</List.Item>
						)}
					/>
				</Spin>
			</Col>
		</Row>
	);
}
