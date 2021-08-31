import jwt from "jsonwebtoken"
import { Token, JwtVerifyTokenPayload } from "types"

const { ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY } = process.env

function verifyRefreshToken(refreshToken: string): JwtVerifyTokenPayload {
	return jwt.verify(refreshToken, REFRESH_TOKEN_SECRET_KEY as string) as JwtVerifyTokenPayload
}

function verifyAccessToken(accessToken: string): JwtVerifyTokenPayload {
	return jwt.verify(accessToken, ACCESS_TOKEN_SECRET_KEY as string) as JwtVerifyTokenPayload
}

function generateAccessToken<T extends {}>(payload: T) {
	return jwt.sign(
		{
			...payload,
			type: "access",
		},
		ACCESS_TOKEN_SECRET_KEY as string,
		{ expiresIn: "5m" }
	)
}

function generateRefreshToken<T extends {}>(payload: T) {
	return jwt.sign(
		{
			...payload,
			type: "refresh",
		},
		REFRESH_TOKEN_SECRET_KEY as string,
		{ expiresIn: "30d" }
	)
}

function generateToken<T extends {}>(payload: T): Token {
	const accessToken = generateAccessToken(payload)
	const refreshToken = generateRefreshToken(payload)

	return {
		accessToken,
		refreshToken,
	}
}

const TokenService = {
	getAll: generateToken,
	getAccess: generateAccessToken,
	getRefresh: generateRefreshToken,
	verifyRefresh: verifyRefreshToken,
	verifyAccess: verifyAccessToken,
}

export default TokenService
export { generateToken }
