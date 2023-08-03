import {
	createSlice,
	createAsyncThunk,
	createEntityAdapter,
} from '@reduxjs/toolkit';

import * as api from '../api';
import type {
	Client,
	NewClient,
	NewPersonalRecord,
	PersonalRecord,
} from '../model';

// ---

const clientAdapter = createEntityAdapter({
	selectId: (client: Client) => client._id,
	sortComparer: (a: Client, b: Client) => a.name.localeCompare(b.name),
});

export const fetchClients = createAsyncThunk(
	'clients/fetchClients',
	async () => {
		const response = await api.getClients();
		return response.data;
	}
);

export const addClient = createAsyncThunk(
	'clients/addClient',
	async (client: NewClient) => {
		const response = await api.createClient(client);
		return response.data;
	}
);

export const deleteClient = createAsyncThunk(
	'clients/removeClient',
	async (id: string) => {
		await api.deleteClient(id);
		return id;
	}
);

export const updateClient = createAsyncThunk(
	'clients/updateClient',
	async (client: Client) => {
		await api.updateClient(client._id, client);
		return client;
	}
);

interface AddRecordPayload {
	clientId: string;
	newRecord: NewPersonalRecord;
}

export const addRecord = createAsyncThunk(
	'clients/addRecord',
	async ({ clientId, newRecord }: AddRecordPayload) => {
		const response = await api.createRecord(clientId, newRecord);
		return response.data;
	}
);

interface DeleteRecordPayload {
	clientId: string;
	recordId: string;
}

export const deleteRecord = createAsyncThunk(
	'clients/removeRecord',
	async ({ clientId, recordId }: DeleteRecordPayload) => {
		await api.deleteRecord(clientId, recordId);
		return { clientId, recordId };
	}
);

interface UpdateRecordPayload {
	clientId: string;
	record: PersonalRecord;
}

export const updateRecord = createAsyncThunk(
	'clients/updateRecord',
	async ({ clientId, record }: UpdateRecordPayload) => {
		await api.updateRecord(clientId, record._id, record);
		return { clientId, record };
	}
);

const initialState = clientAdapter.getInitialState({
	isLoading: true,
});

interface GlobalStatePart {
	clients: typeof initialState;
}

const clientSlice = createSlice({
	name: 'clients',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchClients.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(fetchClients.fulfilled, (state, action) => {
				state.isLoading = false;
				clientAdapter.setAll(state, action.payload);
			})
			.addCase(addClient.fulfilled, (state, action) => {
				clientAdapter.addOne(state, action.payload);
			})
			.addCase(deleteClient.fulfilled, (state, action) => {
				clientAdapter.removeOne(state, action.payload);
			})
			.addCase(updateClient.fulfilled, (state, action) => {
				clientAdapter.updateOne(state, {
					id: action.payload._id,
					changes: action.payload,
				});
			})
			.addCase(addRecord.fulfilled, (state, action) => {
				const { clientId, record } = action.payload;
				const client = state.entities[clientId];
				if (client) {
					client.personalRecords.push(record);
				}
			})
			.addCase(deleteRecord.fulfilled, (state, action) => {
				const { clientId, recordId } = action.payload;
				const client = state.entities[clientId];
				if (client) {
					client.personalRecords = client.personalRecords.filter(
						(r: PersonalRecord) => r._id !== recordId
					);
				}
			})
			.addCase(updateRecord.fulfilled, (state, action) => {
				const { clientId, record } = action.payload;
				const client = state.entities[clientId];
				if (client) {
					const index = client.personalRecords.findIndex(
						(r: PersonalRecord) => r._id === record._id
					);
					if (index !== -1) {
						client.personalRecords[index] = record;
					}
				}
			});
	},
});

export const {
	selectAll: selectAllClients,
	selectById: selectClientById,
	selectIds: selectClientIds,
} = clientAdapter.getSelectors<GlobalStatePart>((state) => state.clients);

export const selectIsLoading = (state: GlobalStatePart) =>
	state.clients.isLoading;

export default clientSlice.reducer;
