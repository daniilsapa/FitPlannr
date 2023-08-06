import React, { useEffect, useState } from 'react';
import {
	Layout,
	Menu,
	ConfigProvider,
	Switch,
	Image,
	theme,
	Select,
} from 'antd';
import {
	BuildOutlined,
	RiseOutlined,
	UnorderedListOutlined,
	UserOutlined,
} from '@ant-design/icons';
import { Routes, Route, BrowserRouter, useNavigate } from 'react-router-dom';

// Types
import type { MenuProps } from 'antd';

import ProtectedRoute from './app/ProtectedRoute';
import { useAppDispatch, useAppSelector } from './app/hooks';
import {
	getUserProfile,
	selectIsAuthenticated,
	selectIsLoading,
} from './entities/user/lib/userSlice';
import { I18nProvider, locales } from './app/i18n';
import AuthPage from './pages/auth';

import logo from './app/logo.svg';
import logoWhite from './app/logo-white.svg';
import ukrainianFlag from './app/ua-locale.jpg';
import russianFlag from './app/ru-locale.jpg';
import greatBritainFlag from './app/en-locale.jpg';

import CategoriesPage from './pages/categories';
import CategorySinglePage from './pages/category-single';
import { fetchCategories } from './entities/category/lib/category-slice';
import { fetchClients } from './entities/client/lib/client-slice';
import { fetchWorkouts } from './entities/workout/lib/workout-slice';
import { fetchExercises } from './entities/exercise/lib/exercise-slice';
import ExerciseSinglePage from './pages/exercise-single';
import ExercisesPage from './pages/exercises';
import WorkoutSinglePage from './pages/workout-single';
import WorkoutsPage from './pages/workouts';
import ClientsPage from './pages/clients';
import ClientSinglePage from './pages/client-single';
import { I18nMessage } from './shared/ui/i18n';
import NotFoundPage from './pages/not-found';

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

const items: MenuItem[] = [
	prepareItemProps(<I18nMessage id="Workout.workouts" />, 1, <RiseOutlined />),
	prepareItemProps(<I18nMessage id="Client.clients" />, 2, <UserOutlined />),
	prepareItemProps(
		<I18nMessage id="Exercise.exercises" />,
		3,
		<BuildOutlined />
	),
	prepareItemProps(
		<I18nMessage id="Category.categories" />,
		4,
		<UnorderedListOutlined />
	),
];

interface ThemeData {
	[key: string]: typeof theme.defaultAlgorithm | typeof theme.darkAlgorithm;
}

interface SideBarMenuProps {
	menuItems: MenuItem[];
}

const navigation = [
	{ label: 'Workouts', key: 1, target: '/workouts' },
	{ label: 'Clients', key: 2, target: '/clients' },
	{ label: 'Exercises', key: 3, target: '/exercises' },
	{ label: 'Categories', key: 4, target: '/categories' },
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
	const isLoading = useAppSelector(selectIsLoading);
	const dispatch = useAppDispatch();
	const [locale, setLocale] = useState(
		localStorage.getItem('locale') || locales.UKRAINIAN
	);
	const [currentTheme, setTheme] = useState(
		localStorage.getItem(THEME_STORAGE_KEY) || 'light'
	);

	const handleThemeChange = (checked: boolean) => {
		setTheme(checked ? 'dark' : 'light');
		localStorage.setItem(THEME_STORAGE_KEY, checked ? 'dark' : 'light');
	};

	const changeLocale = (selectedLocale: string) => {
		localStorage.setItem('locale', selectedLocale);
		setLocale(selectedLocale);
	};

	useEffect(() => {
		if (!isAuthenticated && isLoading) {
			dispatch(getUserProfile());
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAuthenticated, isLoading]);

	useEffect(() => {
		if (isAuthenticated) {
			dispatch(fetchCategories());
			dispatch(fetchExercises());
			dispatch(fetchClients());
			dispatch(fetchWorkouts());
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAuthenticated]);

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
								<div
									style={{ maxWidth: '40em', minWidth: '40em', width: '100%' }}
								>
									{isAuthenticated && <NavMenu menuItems={items} />}
								</div>
							</div>

							<div
								style={{ display: 'flex', gap: '0 1em', alignItems: 'center' }}
							>
								<div>
									<Select
										onChange={changeLocale}
										defaultValue={locale}
										style={{ width: '12em' }}
									>
										<Select.Option value={locales.UKRAINIAN}>
											<div className="locale-wrapper">
												<Image
													alt="Ukrainian flag"
													width="2em"
													preview={false}
													src={ukrainianFlag}
												/>
												<div className="locale-wrapper-text">Українська</div>
											</div>
										</Select.Option>

										<Select.Option value={locales.ENGLISH}>
											<div className="locale-wrapper">
												<Image
													alt="Flag of Great Britain"
													width="2em"
													preview={false}
													src={greatBritainFlag}
												/>
												<div className="locale-wrapper-text">English</div>
											</div>
										</Select.Option>

										<Select.Option value={locales.RUSSIAN}>
											<div className="locale-wrapper">
												<Image
													alt="Flag of opposition to the 2022 Russian invasion of Ukraine"
													width="2em"
													preview={false}
													src={russianFlag}
												/>
												<div className="locale-wrapper-text">Русский</div>
											</div>
										</Select.Option>
									</Select>
								</div>
								<Switch
									checkedChildren="🌙"
									unCheckedChildren="☀️"
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
											isAuthenticated={
												isLoading || (isAuthenticated && !isLoading)
											}
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
											isAuthenticated={
												isLoading || (isAuthenticated && !isLoading)
											}
										>
											<CategorySinglePage />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/exercise"
									element={
										<ProtectedRoute
											navigateTo="/auth"
											isAuthenticated={
												isLoading || (isAuthenticated && !isLoading)
											}
										>
											<ExerciseSinglePage />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/exercise/:id"
									element={
										<ProtectedRoute
											navigateTo="/auth"
											isAuthenticated={
												isLoading || (isAuthenticated && !isLoading)
											}
										>
											<ExerciseSinglePage />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/exercises"
									element={
										<ProtectedRoute
											navigateTo="/auth"
											isAuthenticated={
												isLoading || (isAuthenticated && !isLoading)
											}
										>
											<ExercisesPage />
										</ProtectedRoute>
									}
								/>

								<Route
									path="/client"
									element={
										<ProtectedRoute
											navigateTo="/auth"
											isAuthenticated={
												isLoading || (isAuthenticated && !isLoading)
											}
										>
											<ClientSinglePage />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/client/:id"
									element={
										<ProtectedRoute
											navigateTo="/auth"
											isAuthenticated={
												isLoading || (isAuthenticated && !isLoading)
											}
										>
											<ClientSinglePage />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/clients"
									element={
										<ProtectedRoute
											navigateTo="/auth"
											isAuthenticated={
												isLoading || (isAuthenticated && !isLoading)
											}
										>
											<ClientsPage />
										</ProtectedRoute>
									}
								/>

								<Route
									path="/categories"
									element={
										<ProtectedRoute
											navigateTo="/auth"
											isAuthenticated={
												isLoading || (isAuthenticated && !isLoading)
											}
										>
											<CategoriesPage />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/workout"
									element={
										<ProtectedRoute
											navigateTo="/auth"
											isAuthenticated={
												isLoading || (isAuthenticated && !isLoading)
											}
										>
											<WorkoutSinglePage />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/workout/:id"
									element={
										<ProtectedRoute
											navigateTo="/auth"
											isAuthenticated={
												isLoading || (isAuthenticated && !isLoading)
											}
										>
											<WorkoutSinglePage />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/workouts"
									element={
										<ProtectedRoute
											navigateTo="/auth"
											isAuthenticated={
												isLoading || (isAuthenticated && !isLoading)
											}
										>
											<WorkoutsPage />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/"
									element={
										<ProtectedRoute
											navigateTo="/auth"
											isAuthenticated={
												isLoading || (isAuthenticated && !isLoading)
											}
										>
											<WorkoutsPage />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/auth"
									element={
										<AuthPage
											isAuthenticated={
												isLoading || (isAuthenticated && !isLoading)
											}
										/>
									}
								/>
								<Route
									path="*"
									element={
										<ProtectedRoute
											navigateTo="/auth"
											isAuthenticated={
												isLoading || (isAuthenticated && !isLoading)
											}
										>
											<NotFoundPage />
										</ProtectedRoute>
									}
								/>
							</Routes>
						</Content>
						<Footer>Fitplannr</Footer>
					</Layout>
				</I18nProvider>
			</BrowserRouter>
		</ConfigProvider>
	);
}

export default App;
