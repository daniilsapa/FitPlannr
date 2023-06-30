import api, { authenticateAPI } from '../../../shared/api';

// ---

export function signIn(email: string, password: string) {
	return api.post('/auth/sign-in', { email, password }).then((response) => {
		if (response.status === 200) {
			authenticateAPI(response.data.accessToken);
		}
		return Promise.resolve(response);
	});
}

export function signUp(email: string, password: string, inviteCode: string) {
	return api.post('/auth/sign-up', { email, password, inviteCode });
}

export function getProfile() {
	return api.get('/auth/profile');
}

export { isAPIAuthenticated } from '../../../shared/api';
