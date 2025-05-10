import { ApiProperty } from '@nestjs/swagger'
import { CreateDateColumn } from 'typeorm'
import {
	IsNotEmpty, IsString,
	IsEmail, IsNumber, IsBoolean
} from 'class-validator'

export class UserDto {
	@ApiProperty({ example: 'user name' })
	@IsNotEmpty()
	@IsString()
	name: string

	@ApiProperty({ example: 'user surname' })
	@IsNotEmpty()
	@IsString()
	surname: string

	@ApiProperty({ example: 'user patronymic' })
	@IsNotEmpty()
	@IsString()
	patronymic: string

	@ApiProperty({ example: 'password hash' })
	@IsNotEmpty()
	@IsString()
	passwordHash: string

	@ApiProperty({ example: 'user@example.com' })
	@IsEmail()
	@IsString()
	email: string

	@ApiProperty({ example: 'organization id' })
	@IsNumber()
	organizationId: number

	@ApiProperty({ example: 'user is admin' })
	@IsBoolean()
	isAdmin: boolean

	@ApiProperty({ example: '2025-01-01 00:00:01' })
	@IsNotEmpty()
	@CreateDateColumn()
	dateCreate: Date
}
