import axios, {
	AxiosInstance,
	AxiosRequestConfig,
	AxiosRequestHeaders,
	InternalAxiosRequestConfig,
} from 'axios';

// ---

const ACCESS_TOKEN_STORAGE_KEY = 'accessToken';
const AXIOS_CONFIG: AxiosRequestConfig = {
	baseURL: import.meta.env.VITE_API_BASE_URL,
	withCredentials: true,
};

const axiosInstance: AxiosInstance = axios.create(AXIOS_CONFIG);

axiosInstance.interceptors.request.use(
	(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
		const token = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
		const newHeaders = {
			...config.headers,
			Authorization: `Bearer ${token}`,
		} as AxiosRequestHeaders;

		if (token) {
			return {
				...config,
				headers: newHeaders,
			};
		}
		return config;
	}
);

export function getGoogleAuthUrl(inviteCode?: string) {
	return inviteCode
		? `${import.meta.env.VITE_API_BASE_URL}/auth/google/login?ic=${inviteCode}`
		: `${import.meta.env.VITE_API_BASE_URL}/auth/google/login`;
}

export function authenticateAPI(token: string) {
	localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
}

export function isAPIAuthenticated() {
	return !!localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
}

export default axiosInstance;
