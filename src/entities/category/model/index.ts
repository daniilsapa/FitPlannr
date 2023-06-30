export type Category = {
	_id: string;
	name: string;
	color: string;
};

export type NewCategory = Omit<Category, '_id'>;
