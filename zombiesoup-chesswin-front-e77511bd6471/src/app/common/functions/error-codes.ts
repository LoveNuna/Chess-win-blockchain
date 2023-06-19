const errorCodes = {
	playerNotAvailableException: 'PlayersNotAvailableException'
};

export function getErrorFromCode(code: string): string {
	let errorMessage = '';

	switch (code) {
	case errorCodes.playerNotAvailableException:
		errorMessage = 'Player is not available at the moment!';
		break;

	default:
		errorMessage = 'There was an error processing your request!';
		break;
	}

	return errorMessage;
}
