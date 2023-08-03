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
} from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
	deleteClient,
	selectAllClients,
	selectIsLoading as selectClientsAreLoading,
} from '../../entities/client/lib/client-slice';

// ---

const { Search } = Input;

interface ClientSearchProps {
	onSearch: (value: string) => void;
}

function ClientSearch({ onSearch }: ClientSearchProps) {
	const navigate = useNavigate();
	return (
		<Space.Compact block size="large">
			<Search
				placeholder="Start typing to search..."
				allowClear
				size="large"
				onSearch={onSearch}
			/>
			<Button onClick={() => navigate('/client')}>
				<PlusOutlined />
			</Button>
		</Space.Compact>
	);
}

export default function ClientsPage() {
	const loading = useAppSelector(selectClientsAreLoading);
	const clients = useAppSelector(selectAllClients);
	const dispatch = useAppDispatch();
	const [filterQuery, setFilterQuery] = useState('');
	const filteredData = clients
		.map(({ _id, ...rest }) => ({ ...rest, id: _id }))
		.filter((item) =>
			item.name.toLowerCase().includes(filterQuery.toLowerCase())
		);

	const text = 'Are you sure to delete this task?';
	const description = 'Delete the task';

	return (
		<Row>
			<Col span={8} offset={8}>
				<Spin spinning={loading}>
					<ClientSearch onSearch={setFilterQuery} />
					<Divider />
					<List
						size="small"
						bordered
						dataSource={filteredData}
						renderItem={(item) => (
							<List.Item key={item.id}>
								{item.name}
								<div>
									<Link to={`/client/${item.id}`}>
										<Button type="text">
											<EditOutlined />
										</Button>
									</Link>
									<Popconfirm
										placement="topRight"
										title={text}
										description={description}
										onConfirm={() => dispatch(deleteClient(item.id))}
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
				</Spin>
			</Col>
		</Row>
	);
}
