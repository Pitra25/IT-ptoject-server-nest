import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import process from 'node:process'
import { logger } from '@/log'

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private jwtService: JwtService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request);
		if (!token) {
			logger.error('auth', 'auth-guard-canActivate', 'Token failed')
			throw new UnauthorizedException()
		}
		try {
			const payload = await this.jwtService.verifyAsync(
				token,
				{
					secret: process.env.JWT_SECRET,
				}
			)
			// 💡 We're assigning the payload to the request object here
			// so that we can access it in our route handlers
			request['user'] = payload
		} catch {
			logger.error('auth', 'auth-guard-canActivate', 'Authentication failed', request)
			throw new UnauthorizedException()
		}
		logger.info('auth', 'auth-guard-canActivate', `Authentication successfully. User: ${request['user'].userName}`)
		return true
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? []
		return type === 'Bearer' ? token : undefined
	}
}
