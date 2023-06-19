import React, { useState } from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { Layout, Menu, Row, Col, ConfigProvider, Switch, theme } from 'antd';
import { UnorderedListOutlined, HomeOutlined } from '@ant-design/icons';
import { Routes, Route, BrowserRouter, useNavigate } from 'react-router-dom';

// Types
import type { MenuProps } from 'antd';
import type { SiderTheme } from 'antd/lib/layout/Sider';

import { I18nProvider, locales } from './i18n';
import store from './app/store';
import AboutPage from './pages/about';
import MainPage from './pages/main';
import './App.css';

// ---

const { Header, Footer, Sider, Content } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

function prepareItemProps(
	label: React.ReactNode,
	key: React.Key,
	icon?: React.ReactNode,
	children?: MenuItem[],
	type?: 'group'
): MenuItem {
	return {
		key,
		icon,
		children,
		label,
		type,
	} as MenuItem;
}

const localeSequence = [locales.ENGLISH, locales.UKRAINIAN, locales.RUSSIAN];

const items: MenuItem[] = [
	prepareItemProps('Home', 1, <HomeOutlined />),
	prepareItemProps('About', 2, <UnorderedListOutlined />),
];

interface ThemeData {
	[key: string]: typeof theme.defaultAlgorithm | typeof theme.darkAlgorithm;
}

interface SideBarMenuProps {
	menuItems: MenuItem[];
}

const navigation = [
	{ label: 'Home', key: 1, target: '/' },
	{ label: 'About', key: 2, target: '/about' },
];

const themes: ThemeData = {
	light: theme.defaultAlgorithm,
	dark: theme.darkAlgorithm,
};

function SideBarMenu({ menuItems }: SideBarMenuProps) {
	const navigate = useNavigate();
	const handleMenuClick = ({ key }: { key: string }) => {
		const { target } =
			navigation.find((item) => item.key === Number(key)) || {};

		if (target) {
			navigate(target);
		}
	};

	return (
		<Menu
			defaultSelectedKeys={['1']}
			defaultOpenKeys={['sub1']}
			mode="inline"
			onClick={handleMenuClick}
			items={menuItems}
		/>
	);
}

function App() {
	const [locale, setLocale] = useState(locales.ENGLISH);
	const [currentTheme, setTheme] = useState('light');

	const handleThemeChange = (checked: boolean) => {
		setTheme(checked ? 'dark' : 'light');
	};

	const changeLocale = () => {
		const index = localeSequence.indexOf(locale);
		const nextIndex = index + 1;
		const nextLocale = localeSequence[nextIndex] || localeSequence[0];

		setLocale(nextLocale);
	};

	return (
		<ConfigProvider
			theme={{
				algorithm: themes[currentTheme],
				token: {
					colorPrimary: '#5c99c8',
				},
			}}
		>
			<StoreProvider store={store}>
				<BrowserRouter>
					<I18nProvider locale={locale}>
						<Layout style={{ minHeight: '100vh' }}>
							<Header>Header</Header>
							<Layout hasSider>
								<Sider theme={currentTheme as SiderTheme}>
									<SideBarMenu menuItems={items} />
									<Switch
										checkedChildren="Dark"
										unCheckedChildren="Light"
										onChange={handleThemeChange}
									/>
								</Sider>
								<Content>
									<Row>
										<Col span={24}>
											<Routes>
												<Route path="/" element={<MainPage />} />
												<Route
													path="/about"
													element={
														<AboutPage
															onChangeLocale={changeLocale}
															locale={locale}
														/>
													}
												/>
											</Routes>
										</Col>
									</Row>
								</Content>
							</Layout>
							<Footer>Footer</Footer>
						</Layout>
					</I18nProvider>
				</BrowserRouter>
			</StoreProvider>
		</ConfigProvider>
	);
}

export default App;
