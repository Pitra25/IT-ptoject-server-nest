import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsEmail, IsNumber, IsBoolean } from 'class-validator'
import { CreateDateColumn } from 'typeorm'

export class CreateUserDto {
	@ApiProperty({ example: 'user name' })
	@IsNotEmpty()
	@IsString()
	name: string

	@ApiProperty({ example: 'user last name' })
	@IsNotEmpty()
	@IsString()
	lastName: string

	@ApiProperty({ example: 'user patronymic' })
	@IsNotEmpty()
	@IsString()
	patronymic: string

	@ApiProperty({ example: 'user surname' })
	@IsNotEmpty()
	@IsString()
	surname: string

	@ApiProperty({ example: 'password hash' })
	@IsNotEmpty()
	@IsString()
	passwordHash: string

	@ApiProperty({ example: 'user@example.com' })
	@IsEmail()
	@IsString()
	email: string

	@ApiProperty({ example: 'new organization' })
	@IsBoolean()
	newOrganization: boolean

	@ApiProperty({ example: 'organization name' })
	@IsNotEmpty()
	@IsString()
	organization: string

	@ApiProperty({ example: "2025-01-01 00:00:01" })
	@IsNotEmpty()
	@CreateDateColumn()
	dateCreate: Date
}
