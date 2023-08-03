import React, { useState } from 'react';
import { List, Input, Col, Row, Divider, Tag, Button, Space, Spin } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';

import { useAppSelector } from '../../app/hooks';
import {
	selectAllCategories,
	selectIsLoading as selectCategoriesAreLoading,
} from '../../entities/category/lib/category-slice';

// ---

const { Search } = Input;

interface CategorySearchProps {
	onSearch: (value: string) => void;
}

function CategorySearch({ onSearch }: CategorySearchProps) {
	const navigate = useNavigate();
	return (
		<Space.Compact block size="large">
			<Search
				placeholder="Start typing to search..."
				allowClear
				size="large"
				onSearch={onSearch}
			/>
			<Button onClick={() => navigate('/category')}>
				<PlusOutlined />
			</Button>
		</Space.Compact>
	);
}

export default function CategoriesPage() {
	const loading = useAppSelector(selectCategoriesAreLoading);
	const categories = useAppSelector(selectAllCategories);
	const [filterQuery, setFilterQuery] = useState('');
	const filteredData = categories
		.map(({ _id, ...rest }) => ({ ...rest, id: _id }))
		.filter((item) =>
			item.name.toLowerCase().includes(filterQuery.toLowerCase())
		);

	return (
		<Row>
			<Col span={8} offset={8}>
				<Spin spinning={loading}>
					<CategorySearch onSearch={setFilterQuery} />
					<Divider />
					<List
						size="small"
						bordered
						dataSource={filteredData}
						renderItem={(item) => (
							<List.Item key={item.id}>
								<Tag color={item.color}>{item.name}</Tag>
								<div>
									<Link to={`/category/${item.id}`}>
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
