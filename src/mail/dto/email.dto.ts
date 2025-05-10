import { ApiProperty } from '@nestjs/swagger'
import { CreateDateColumn } from 'typeorm'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class EmailDto {
	@ApiProperty({ example: 'user name' })
	@IsNotEmpty()
	@IsString()
	senderName: string

	@ApiProperty({ example: 'user last name' })
	@IsNotEmpty()
	@IsString()
	senderLastName: string

	@ApiProperty({ example: 'user@example.com' })
	@IsEmail()
	@IsString()
	senderEmail: string

	@ApiProperty({ example: 'message' })
	@IsString()
	senderMessage: string

	@ApiProperty({ example: "2025-01-01 00:00:01" })
	@IsNotEmpty()
	@CreateDateColumn()
	dateCreate: Date
}
