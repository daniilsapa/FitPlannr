import React, { useEffect, useState } from 'react';
import {
	Layout,
	Menu,
	ConfigProvider,
	Image,
	theme,
	Popover,
	Button,
} from 'antd';
import {
	BuildOutlined,
	MenuOutlined,
	RiseOutlined,
	UnorderedListOutlined,
	UserOutlined,
} from '@ant-design/icons';
import { Routes, Route, BrowserRouter, useNavigate } from 'react-router-dom';

// Types
import type { MenuProps } from 'antd';

import ProtectedRoute from './ProtectedRoute';
import { useAppDispatch, useAppSelector } from './hooks';
import {
	getUserProfile,
	selectIsAuthenticated,
	selectIsLoading,
} from '../entities/user/lib/userSlice';
import { I18nProvider, locales } from './i18n';

// UI
import AuthPage from '../pages/auth';
import LogOutButton from '../entities/user/ui/LogOutButton';
import CategoriesPage from '../pages/categories';
import CategorySinglePage from '../pages/category-single';
import { fetchCategories } from '../entities/category/lib/category-slice';
import { fetchClients } from '../entities/client/lib/client-slice';
import { fetchWorkouts } from '../entities/workout/lib/workout-slice';
import { fetchExercises } from '../entities/exercise/lib/exercise-slice';
import ExerciseSinglePage from '../pages/exercise-single';
import ExercisesPage from '../pages/exercises';
import WorkoutSinglePage from '../pages/workout-single';
import WorkoutsPage from '../pages/workouts';
import ClientsPage from '../pages/clients';
import ClientSinglePage from '../pages/client-single';
import { I18nMessage } from '../shared/ui/i18n';
import NotFoundPage from '../pages/not-found';
import LocaleSwitcher from './ui/LocaleSwitcher';

// Styles
import './index.css';

// Assets

import logo from './logo.svg';
import logoWhite from './logo-white.svg';
import ThemeSwitcher from './ui/ThemeSwitcher';
import UnderConstructionPlug from './ui/UnderConstructionPlug';

// ---

const { Header, Content } = Layout;
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

interface SideBarMenuProps {
	menuItems: MenuItem[];
	inline?: boolean;
}

function NavMenu({ menuItems, inline }: SideBarMenuProps) {
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
			mode={inline ? 'inline' : 'horizontal'}
			onClick={handleMenuClick}
			items={menuItems}
			expandIcon={<MenuOutlined />}
		/>
	);
}

NavMenu.defaultProps = {
	inline: false,
};

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
					<UnderConstructionPlug />

					<Layout style={{ minHeight: '100vh' }}>
						<Header>
							<div
								style={{
									display: 'flex',
								}}
							>
								<div>
									<Image
										alt="Site logo"
										src={currentTheme === 'dark' ? logoWhite : logo}
										width="100px"
										preview={false}
									/>
								</div>

								<div
									className="desktop-menu"
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between',
										paddingLeft: '1em',
										width: '100%',
									}}
								>
									<div
										style={{
											maxWidth: '40em',
											minWidth: '40em',
											width: '100%',
										}}
									>
										{isAuthenticated && <NavMenu menuItems={items} />}
									</div>
									<div
										style={{
											display: 'flex',
											gap: '0 1em',
											alignItems: 'center',
										}}
									>
										<div>{isAuthenticated && <LogOutButton />}</div>

										<div>
											<LocaleSwitcher
												locale={locale}
												onChangeLocale={changeLocale}
											/>
										</div>
										<ThemeSwitcher
											theme={currentTheme}
											onThemeChange={handleThemeChange}
										/>
									</div>
								</div>

								<div className="mobile-menu">
									<Popover
										content={
											<div
												style={{
													display: 'flex',
													flexDirection: 'column',
													gap: '2em 0',
												}}
											>
												<div>
													{isAuthenticated && (
														<NavMenu menuItems={items} inline />
													)}
												</div>

												<div>
													<LocaleSwitcher
														locale={locale}
														onChangeLocale={changeLocale}
													/>
												</div>

												<div
													style={{
														display: 'flex',
														justifyContent: 'space-between',
														alignItems: 'center',
													}}
												>
													<ThemeSwitcher
														theme={currentTheme}
														onThemeChange={handleThemeChange}
													/>
													{isAuthenticated && <LogOutButton />}
												</div>
											</div>
										}
										color="rgb(0, 21, 41)"
										overlayInnerStyle={{
											boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.6)',
										}}
										trigger="click"
										placement="bottomRight"
									>
										<Button>
											<MenuOutlined />
										</Button>
									</Popover>
								</div>
							</div>
						</Header>
						<Content style={{ paddingTop: '2em' }}>
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
					</Layout>
				</I18nProvider>
			</BrowserRouter>
		</ConfigProvider>
	);
}

export default App;
