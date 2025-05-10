import { ApiProperty } from '@nestjs/swagger'
import { CreateDateColumn } from 'typeorm'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class PostDto {
	@ApiProperty({ example: 'post name' })
	@IsNotEmpty()
	@IsString()
	name: string

	@ApiProperty({ example: 'post description' })
	@IsNotEmpty()
	@IsString()
	description: string

	@ApiProperty({ example: 'author id' })
	@IsNotEmpty()
	@IsNumber()
	author_id: number

	@ApiProperty({ example: "2025-01-01 00:00:01" })
	@IsNotEmpty()
	@CreateDateColumn()
	dateCreate: Date
}