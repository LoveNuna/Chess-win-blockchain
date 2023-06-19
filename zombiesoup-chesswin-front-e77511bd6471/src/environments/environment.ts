export const environment = {
	production: false,

	cognito: {
		identityPoolId: 'us-east-1:b45bb2a2-48f2-42a3-969b-d2b3a449a60f',
		poolId: 'us-east-1_0V7haYqKL',
		poolName: 'chesswinpool',
		webClientId: '3n2l7ra0gp727b75us26f0d634',
		region: 'us-east-1',
	},

	socket: {
		userPoolName: 'chesswinpool',
		userPoolId: 'us-east-1_0V7haYqKL',
		userPoolWebClientId: '3n2l7ra0gp727b75us26f0d634',
		identityPoolId: 'us-east-1:b45bb2a2-48f2-42a3-969b-d2b3a449a60f',
		userPoolRegion: 'us-east-1',
		webSocketUrl: 'wss://o769297b03.execute-api.us-east-1.amazonaws.com/prod/',
	},

	lambdaAlias: '$LATEST',

	admin: {
		username: 'admin@chesswin',
		password: '123456',
	},
};
