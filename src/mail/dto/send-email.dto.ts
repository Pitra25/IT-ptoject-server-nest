import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { EmailDto } from './email.dto'

export class SendEmailDto {
	@ApiProperty({ example: 'mail@mail.ru' })
	@IsString()
	readonly to?: string

	@ApiProperty({ example: 'Subject mail' })
	@IsString()
	readonly subject: string

	@ApiProperty({ example: 'Text mail', required: false })
	@IsString()
	readonly text?: string

	@ApiProperty({ example: EmailDto })
	readonly message: EmailDto
}
