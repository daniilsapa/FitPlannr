import React, { useState } from 'react';
import { List, Input, Col, Row, Divider, Tag, Button, Space, Spin } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';

import { useAppSelector } from '../../app/hooks';
import {
	selectAllExercises,
	selectIsLoading as selectExercisesAreLoading,
} from '../../entities/exercise/lib/exercise-slice';
import {
	selectCategoryEntities,
	selectIsLoading as selectCategoriesAreLoading,
} from '../../entities/category/lib/category-slice';

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
							<List.Item key={item.id}>
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

								<div>
									<Link to={`/exercise/${item.id}`}>
										<Button type="text">
											<EditOutlined />
										</Button>
									</Link>
								</div>
							</List.Item>
						)}
					/>
				</Spin>
			</Col>
		</Row>
	);
}
