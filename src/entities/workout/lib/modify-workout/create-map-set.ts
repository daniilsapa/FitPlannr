import { PlannedSet } from '../../model';
import { MapSet } from './types';

// ---

export default function createMapSet(onSet: MapSet | undefined) {
	return (set: PlannedSet | undefined) => {
		return onSet ? onSet(set) : set;
	};
}
