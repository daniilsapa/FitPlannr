import { Week } from '../../model';
import { MapDay, MapWeek } from './types';

// ---

export default function createMapWeek(onWeek?: MapWeek, mapDay?: MapDay) {
	return (week?: Week) => {
		let modifiedWeek: Week | undefined | null = week;

		if ((!onWeek && !mapDay) || !modifiedWeek) {
			return modifiedWeek;
		}

		if (onWeek) {
			modifiedWeek = onWeek(modifiedWeek);
		}

		if (mapDay) {
			modifiedWeek = {
				...modifiedWeek,
				// @ts-ignore
				days: modifiedWeek.days.map(mapDay),
			};
		}

		return modifiedWeek;
	};
}
