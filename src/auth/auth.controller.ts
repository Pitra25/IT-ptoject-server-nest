import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Request,
	UseGuards
} from '@nestjs/common'
import { AuthService } from '@/auth/auth.service'
import { AuthGuard } from './guard/auth.guard'
import { SingInDto } from '@/auth/dto/singIn.dto'

@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService
	) {}

	@HttpCode(HttpStatus.OK)
	@Post('login')
	SingIn(@Body() signIn: SingInDto) {
		return this.authService.signIn(signIn.name, signIn.password)
	}

	@UseGuards(AuthGuard)
	@Get('profile')
	getProfile(@Request() req) {
		return req.user
	}
}
