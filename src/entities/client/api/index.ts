import axiosInstance from '../../../shared/api';
import type {
	Client,
	NewClient,
	PersonalRecord,
	NewPersonalRecord,
} from '../model';

// ---

export function getClients() {
	return axiosInstance.get('/clients');
}

export function createClient(client: NewClient) {
	return axiosInstance.post('/clients', client);
}

export function updateClient(id: string, client: Client) {
	return axiosInstance.patch(`/clients/${id}`, client);
}

export function deleteClient(clientId: string) {
	return axiosInstance.delete(`/clients/${clientId}`);
}

export function createRecord(clientId: string, record: NewPersonalRecord) {
	return axiosInstance.post(`/clients/${clientId}/records`, record);
}

export function deleteRecord(clientId: string, recordId: string) {
	return axiosInstance.delete(`/clients/${clientId}/records/${recordId}`);
}

export function updateRecord(
	clientId: string,
	recordId: string,
	record: PersonalRecord
) {
	return axiosInstance.patch(
		`/clients/${clientId}/records/${recordId}`,
		record
	);
}
