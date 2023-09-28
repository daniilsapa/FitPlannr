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
import {
	deleteCategory,
	selectAllCategories,
	selectIsLoading as selectCategoriesAreLoading,
} from '../../entities/category/lib/category-slice';
import { I18nMessage } from '../../shared/ui/i18n';
import { removeCategoryFromExercises } from '../../entities/exercise/lib/exercise-slice';

// ---

const { Search } = Input;

interface CategorySearchProps {
	onSearch: (value: string) => void;
}

function CategorySearch({ onSearch }: CategorySearchProps) {
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
			<Button onClick={() => navigate('/category')}>
				<PlusOutlined />
			</Button>
		</Space.Compact>
	);
}

export default function CategoriesPage() {
	const dispatch = useAppDispatch();
	const loading = useAppSelector(selectCategoriesAreLoading);
	const categories = useAppSelector(selectAllCategories);
	const [filterQuery, setFilterQuery] = useState('');
	const filteredData = categories
		.map(({ _id, ...rest }) => ({ ...rest, id: _id }))
		.filter((item) =>
			item.name.toLowerCase().includes(filterQuery.toLowerCase())
		);

	const handleRemove = (id: string) => {
		dispatch(deleteCategory(id))
			.unwrap()
			.then(() => {
				dispatch(removeCategoryFromExercises(id));
			});
	};

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
						<CategorySearch onSearch={setFilterQuery} />
						<Divider />
						<List
							size="small"
							bordered
							dataSource={filteredData}
							itemLayout="horizontal"
							renderItem={(item) => (
								<List.Item
									key={item.id}
									actions={[
										<Link key="1" to={`/category/${item.id}`}>
											<Button type="text">
												<EditOutlined />
											</Button>
										</Link>,
										<Popconfirm
											key="2"
											title={<I18nMessage id="Category.deleteCategory" />}
											description={
												<I18nMessage id="Category.deleteCategoryExplanation" />
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
									<Tag color={item.color}>{item.name}</Tag>
								</List.Item>
							)}
						/>
					</Spin>
				</Col>
			</Row>
		</div>
	);
}
