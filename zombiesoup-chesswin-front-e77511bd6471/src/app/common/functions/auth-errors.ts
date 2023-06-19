export const errorCodes = {
	expiredCode: 'ExpiredCodeException',
	invalidClientTokenId: 'InvalidClientTokenId',
	invalidPasswordException: 'InvalidPasswordException',
	notFound: 'NotFound',
	serverError: 'ServerError',
	serverException: 'ServerException',
	serviceUnavailable: 'ServiceUnavailable',
	tokenExpired: 'TokenExpired',
	unauthorized: 'Unauthorized',
	userDoesNotExists: 'UserDoesNotExists',
	usernameExistsException: 'UsernameExistsException',
	userNotConfirmed: 'UserNotConfirmedException',
	userNotFound: 'UserNotFoundException',
	validationError: 'ValidationError'
};

export function getErrorFromCode(code: string): string {
	let message = '';

	switch (code) {
	case errorCodes.expiredCode:
		message = 'Invalid code provided! Please request a code again.';
		break;

	case errorCodes.invalidClientTokenId:
		message = 'Provided token does not exist!';
		break;

	case errorCodes.invalidPasswordException:
		message = 'Invalid password!';
		break;

	case errorCodes.notFound:
		message = 'Not Found.';
		break;

	case errorCodes.serverException:
		message = 'There was a problem in our servers! Please try again.';
		break;

	case errorCodes.serverError:
		message = '';
		break;

	case errorCodes.serviceUnavailable:
		message = 'Service unavailable!';
		break;

	case errorCodes.tokenExpired:
		message = 'Token expired.';
		break;

	case errorCodes.unauthorized:
		message = 'You are unauthorized.';
		break;

	case errorCodes.userDoesNotExists:
		message = 'User does not exists.';
		break;

	case errorCodes.usernameExistsException:
		message = 'A user with this email already exists!';
		break;

	case errorCodes.userNotConfirmed:
		message = 'User is not verified!';
		break;

	case errorCodes.userNotFound:
		message = 'User with corresponding email does not exist!';
		break;

	case errorCodes.validationError:
		message = 'Validation error!';
		break;

	default:
		message = 'An error occurred! Please try again.';
		break;
	}

	return message;
}
