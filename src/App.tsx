import React, { useEffect, useState } from 'react';
import {
	Layout,
	Menu,
	Row,
	Col,
	ConfigProvider,
	Switch,
	Image,
	theme,
} from 'antd';
import { UnorderedListOutlined } from '@ant-design/icons';
import { Routes, Route, BrowserRouter, useNavigate } from 'react-router-dom';

// Types
import type { MenuProps } from 'antd';

import ProtectedRoute from './app/ProtectedRoute';
import { useAppDispatch, useAppSelector } from './app/hooks';
import {
	getUserProfile,
	selectIsAuthenticated,
} from './entities/user/lib/userSlice';
import { I18nProvider, locales } from './app/i18n';
import AboutPage from './pages/about';
import AuthPage from './pages/auth';
import MainPage from './pages/main';

import logo from './app/logo.svg';
import logoWhite from './app/logo-white.svg';
import CategoriesPage from './pages/categories';
import CategorySinglePage from './pages/category-single';
import { fetchCategories } from './entities/category/lib/categorySlice';

// ---

const { Header, Footer, Content } = Layout;
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
	prepareItemProps('Categories', 1, <UnorderedListOutlined />),
	prepareItemProps('Exercises', 2, <UnorderedListOutlined />),
	prepareItemProps('Workouts', 3, <UnorderedListOutlined />),
];

interface ThemeData {
	[key: string]: typeof theme.defaultAlgorithm | typeof theme.darkAlgorithm;
}

interface SideBarMenuProps {
	menuItems: MenuItem[];
}

const navigation = [
	{ label: 'Categories', key: 1, target: '/categories' },
	{ label: 'Exercises', key: 2, target: '/exercises' },
	{ label: 'Workouts', key: 3, target: '/workouts' },
];

const themes: ThemeData = {
	light: theme.defaultAlgorithm,
	dark: theme.darkAlgorithm,
};

function NavMenu({ menuItems }: SideBarMenuProps) {
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
			theme="dark"
			mode="horizontal"
			onClick={handleMenuClick}
			items={menuItems}
		/>
	);
}

const THEME_STORAGE_KEY = 'theme';

function App() {
	const isAuthenticated = useAppSelector(selectIsAuthenticated);
	const dispatch = useAppDispatch();
	const [locale, setLocale] = useState(locales.UKRAINIAN);
	const [currentTheme, setTheme] = useState(
		localStorage.getItem(THEME_STORAGE_KEY) || 'light'
	);

	const handleThemeChange = (checked: boolean) => {
		setTheme(checked ? 'dark' : 'light');
		localStorage.setItem(THEME_STORAGE_KEY, checked ? 'dark' : 'light');
	};

	const changeLocale = () => {
		const index = localeSequence.indexOf(locale);
		const nextIndex = index + 1;
		const nextLocale = localeSequence[nextIndex] || localeSequence[0];

		setLocale(nextLocale);
	};

	useEffect(() => {
		if (isAuthenticated) {
			dispatch(getUserProfile());
			dispatch(fetchCategories());
		}
	});

	return (
		<ConfigProvider
			theme={{
				algorithm: themes[currentTheme],
				token: {
					colorPrimary: '#5c99c8',
				},
			}}
		>
			<BrowserRouter>
				<I18nProvider locale={locale}>
					<Layout style={{ minHeight: '100vh' }}>
						<Header
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
							}}
						>
							<div style={{ display: 'flex', gap: '1em' }}>
								<Image
									alt="Site logo"
									src={currentTheme === 'dark' ? logoWhite : logo}
									width="100px"
									preview={false}
								/>
								<NavMenu menuItems={items} />
							</div>
							<div>
								<Switch
									checkedChildren="Dark"
									unCheckedChildren="Light"
									defaultChecked={currentTheme === 'dark'}
									onChange={handleThemeChange}
								/>
							</div>
						</Header>
						<Content style={{ paddingTop: '3em' }}>
							<Routes>
								<Route
									path="/category/:id"
									element={
										<ProtectedRoute
											navigateTo="/auth"
											isAuthenticated={isAuthenticated}
										>
											<CategorySinglePage />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/category"
									element={
										<ProtectedRoute
											navigateTo="/auth"
											isAuthenticated={isAuthenticated}
										>
											<CategorySinglePage />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/categories"
									element={
										<ProtectedRoute
											navigateTo="/auth"
											isAuthenticated={isAuthenticated}
										>
											<CategoriesPage />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/"
									element={
										<ProtectedRoute
											navigateTo="/auth"
											isAuthenticated={isAuthenticated}
										>
											<Row>
												<Col span={24}>
													<MainPage />
												</Col>
											</Row>
										</ProtectedRoute>
									}
								/>
								<Route
									path="/auth"
									element={<AuthPage isAuthenticated={isAuthenticated} />}
								/>
								<Route
									path="/about"
									element={
										<ProtectedRoute
											navigateTo="/auth"
											isAuthenticated={isAuthenticated}
										>
											<AboutPage
												onChangeLocale={changeLocale}
												locale={locale}
											/>
										</ProtectedRoute>
									}
								/>
							</Routes>
						</Content>
						<Footer>Footer</Footer>
					</Layout>
				</I18nProvider>
			</BrowserRouter>
		</ConfigProvider>
	);
}

export default App;
