import axiosInstance from '../../../shared/api';
import { Category, NewCategory } from '../model';

// ---

export function getCategories() {
	return axiosInstance.get('/categories');
}

export function createCategory(category: NewCategory) {
	return axiosInstance.post('/categories', category);
}

export function deleteCategory(id: string) {
	return axiosInstance.delete(`/categories/${id}`);
}

export function updateCategory(id: string, category: Category) {
	return axiosInstance.patch(`/categories/${id}`, category);
}
