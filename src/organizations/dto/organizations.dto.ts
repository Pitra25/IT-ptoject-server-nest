import { ApiProperty } from '@nestjs/swagger'
import { CreateDateColumn } from 'typeorm'
import { IsNotEmpty, IsString } from 'class-validator'

export class OrganizationsDto {
	@ApiProperty({ example: 'organizations name' })
	@IsNotEmpty()
	@IsString()
	name: string

	@ApiProperty({ example: 'organizations address' })
	@IsNotEmpty()
	@IsString()
	address: string

	@ApiProperty({ example: "2025-01-01 00:00:01" })
	@IsNotEmpty()
	@CreateDateColumn()
	dateCreate: Date
}
