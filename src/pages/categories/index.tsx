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
	theme,
	Popconfirm,
} from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
	deleteCategory,
	selectAllCategories,
} from '../../entities/category/lib/categorySlice';

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
	const categories = useAppSelector(selectAllCategories);
	const dispatch = useAppDispatch();
	const [filterQuery, setFilterQuery] = useState('');
	const filteredData = categories
		.map(({ _id, ...rest }) => ({ ...rest, id: _id }))
		.filter((item) =>
			item.name.toLowerCase().includes(filterQuery.toLowerCase())
		);

	const text = 'Are you sure to delete this task?';
	const description = 'Delete the task';

	return (
		<Row>
			<Col span={8} offset={8}>
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
								<Popconfirm
									placement="topRight"
									title={text}
									description={description}
									onConfirm={() => dispatch(deleteCategory(item.id))}
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
