export interface User {
	aud: string;
	auth_time: number;
	birthdate: string;
	['cognito:username']: string;
	['custom:allow_random']: string;
	['custom:country']: string;
	['custom:gold_points']: string;
	['custom:profile_picture']: string;
	['custom:silver_points']: string;
	email: string;
	email_verified: boolean;
	event_id: string;
	exp: number;
	gender: string;
	iat: number;
	iss: string;
	name: string;
	preferred_username: string;
	sub: string;
	token_use: string;
}
