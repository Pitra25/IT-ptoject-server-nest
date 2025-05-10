import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class SingInDto {
	@ApiProperty({ example: 'name'})
	@IsNotEmpty()
	@IsString()
	name: string

	@ApiProperty({ example: 'password'})
	@IsString()
	@IsNotEmpty()
	password: string
}