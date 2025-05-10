import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { ApiBody, ApiTags } from '@nestjs/swagger'

import { UserService } from './user.service'
import { CreateUserDto } from '@/user/dto/createUser.dto'
import { OrganizationsDto } from '@/organizations/dto/organizations.dto'

@Controller('user')
@ApiTags('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('register')
	@ApiBody({ type: CreateUserDto })
	async create(
		@Body() createUserDto: CreateUserDto,
		@Body() createOrganization: OrganizationsDto
	) {
		return this.userService.create(
			createUserDto,
			createOrganization)
	}

	@Get(':userName')
	async getUserName(@Param('username') userName: string) {
		return await this.getUserName(userName)
	}

	@Get(':id')
	async getUserId(@Param('id') id: number) {
		return await this.userService.findBuId(id)
	}

	@Get('all')
	async getAllUsers() {
		return await this.userService.getAllUsers()
	}
}
