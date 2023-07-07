export type NewPersonalRecord = {
	record: number;
	exercise: string;
};

export type PersonalRecord = {
	_id: string;
	record: number;
	exercise: string;
};

export type Client = {
	_id: string;
	name: string;
	description: string;
	personalRecords: PersonalRecord[];
};

export type NewClient = {
	name: string;
	description: string;
	personalRecords: PersonalRecord[];
};
