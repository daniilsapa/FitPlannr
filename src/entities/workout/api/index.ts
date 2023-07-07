import axiosInstance from '../../../shared/api';
import type { NewWorkout, Workout } from '../model';

// ---

export function getWorkouts() {
	return axiosInstance.get('/workouts');
}

export function createWorkout(workout: NewWorkout) {
	return axiosInstance.post('/workouts', workout);
}

export function updateWorkout(id: string, workout: Workout) {
	return axiosInstance.patch(`/workouts/${id}`, workout);
}

export function deleteWorkout(workoutId: string) {
	return axiosInstance.delete(`/workouts/${workoutId}`);
}
