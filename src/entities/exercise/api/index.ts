import axiosInstance from '../../../shared/api';

import type { Exercise, NewExercise } from '../model';

// ---

export function getExercises() {
	return axiosInstance.get('/exercises');
}

export function createExercise(exercise: NewExercise) {
	return axiosInstance.post('/exercises', exercise);
}

export function deleteExercise(id: string) {
	return axiosInstance.delete(`/exercises/${id}`);
}

export function updateExercise(id: string, exercise: Exercise) {
	return axiosInstance.patch(`/exercises/${id}`, exercise);
}
