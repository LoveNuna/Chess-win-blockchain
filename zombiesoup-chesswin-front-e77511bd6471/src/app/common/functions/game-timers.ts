export function secToMinutesAndSec(sec: number) {
	const minutes = Math.floor(sec / 60);
	const seconds = sec - minutes * 60 + '';

	const time = { minutes, seconds };

	return time;
}

export function gameTimeTypeToSec(gameTimeType: number): number {
	switch (gameTimeType) {
	case 1: // 1min
		return 60;
	case 2: // 1min + 10 sec
		return 60;
	case 3: // 2min
		return 120;
	case 4: // 3min
		return 180;
	case 5: // 3min
		return 180;
	case 6: // 3min
		return 180;
	case 7: // 3min
		return 180;
	case 8: // 5min
		return 300;
	case 9: // 5min
		return 300;
	case 10: // 5min
		return 300;
	case 11: // 5min
		return 300;
	case 12: // 10min
		return 600;
	case 13: // 10min
		return 600;
	case 14: // 15min
		return 900;
	case 15: // 15min
		return 900;
	case 16: // 30min
		return 1800;
	default:
		return 0;
	}
}

export function getAdditionalSec(gameTimeType: number): number {
	switch (gameTimeType) {
	case 1: // 1min
		return 0;
	case 2: // 1min + 10 sec
		return 10;
	case 3: // 2min
		return 10;
	case 4: // 3min
		return 0;
	case 5: // 3min
		return 2;
	case 6: // 3min
		return 5;
	case 7: // 3min
		return 10;
	case 8: // 5min
		return 0;
	case 9: // 5min
		return 2;
	case 10: // 5min
		return 5;
	case 11: // 5min
		return 10;
	case 12: // 10min
		return 0;
	case 13: // 10min
		return 10;
	case 14: // 15min
		return 0;
	case 15: // 15min
		return 10;
	case 16: // 30min
		return 0;
	default:
		return 0;
	}
}

export function getTimeByType(type: number) {
	switch (type) {
	case 1:
		return '1min';
	case 2:
		return '1min + 10s';
	case 3:
		return '2min + 10s';
	case 4:
		return '2min';
	case 5:
		return '3min + 2s';
	case 6:
		return '3min + 5s';
	case 7:
		return '3min + 10s';
	case 8:
		return '4min';
	case 9:
		return '5min + 2s';
	case 10:
		return '5min + 5s';
	case 11:
		return '5min + 10s';
	case 12:
		return '10min';
	case 13:
		return '10min + 10s';
	case 14:
		return '15min';
	case 15:
		return '15min + 10s';
	case 16:
		return '30min ';
	default:
		return '';
	}
}
