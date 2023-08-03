import axios, { AxiosInstance } from 'axios';

// ---

const inviteCodeApiInstance: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_INVITE_CODE_BASE_URL,
});

export async function validateInviteCode(inviteCode: string) {
	return inviteCodeApiInstance.post('/validate-code/', { code: inviteCode });
}

export async function markInviteCodeAsUsed(inviteCode: string) {
	return inviteCodeApiInstance.put('/mark-code-used/', { code: inviteCode });
}

export default inviteCodeApiInstance;
