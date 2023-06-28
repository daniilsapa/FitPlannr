import axios, {
	AxiosInstance,
	AxiosRequestConfig,
	AxiosRequestHeaders,
	InternalAxiosRequestConfig,
} from 'axios';

// ---

const axiosConfig: AxiosRequestConfig = {
	baseURL: import.meta.env.VITE_API_BASE_URL,
};

const axiosInstance: AxiosInstance = axios.create(axiosConfig);

axiosInstance.interceptors.request.use(
	(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
		const token = localStorage.getItem('auth-token');
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

export function setAuthToken(token: string) {
	localStorage.setItem('auth-token', token);
}

export default axiosInstance;
