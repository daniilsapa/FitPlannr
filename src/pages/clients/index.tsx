import React, { useState } from 'react';
import {
	List,
	Input,
	Col,
	Row,
	Divider,
	Button,
	Space,
	Popconfirm,
	Spin,
} from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
	deleteClient,
	selectAllClients,
	selectIsLoading as selectClientsAreLoading,
} from '../../entities/client/lib/client-slice';
import { I18nMessage } from '../../shared/ui/i18n';

// ---

const { Search } = Input;

interface ClientSearchProps {
	onSearch: (value: string) => void;
}

function ClientSearch({ onSearch }: ClientSearchProps) {
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
						<ClientSearch onSearch={setFilterQuery} />
						<Divider />
						<List
							size="small"
							bordered
							dataSource={filteredData}
							renderItem={(item) => (
								<List.Item
									key={item.id}
									actions={[
										<Link key="1" to={`/client/${item.id}`}>
											<Button type="text">
												<EditOutlined />
											</Button>
										</Link>,

										<Popconfirm
											key="2"
											title={<I18nMessage id="Client.deleteClient" />}
											description={
												<I18nMessage id="Client.deleteClientExplanation" />
											}
											placement="topRight"
											onConfirm={() => dispatch(deleteClient(item.id))}
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
									{item.name}
								</List.Item>
							)}
						/>
					</Spin>
				</Col>
			</Row>
		</div>
	);
}
