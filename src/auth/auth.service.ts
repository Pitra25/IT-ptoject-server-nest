import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from '@/user/user.service'
import { JwtService } from '@nestjs/jwt'
import { userEntity } from '@/user/entity/user.entity'
import { logger } from '@/log'

@Injectable()
export class AuthService {
	constructor(
		private usersService: UserService,
		private jwtService: JwtService
	) {}

	async signIn(
		userName: string,
		pass: string
	): Promise<{ access_token: string }> {
		const user: userEntity | null = await this.usersService.findOneName(userName)
		if (user?.passwordHash !== pass) {
			logger.error('auth', 'auth-singIn', 'Error pass user', { user } )
			throw new UnauthorizedException()
		}
		const payload = { sud: user.id, userName: user.name }
		return {
			access_token: await this.jwtService.signAsync(payload, { secret: process.env.JWT_SECRET }),
		}
	}
}
