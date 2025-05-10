import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { ApiBody, ApiTags } from '@nestjs/swagger'

import { EmailService } from './email.service'
import { SendEmailDto } from './dto/send-email.dto'
import { emailEntity } from '@/mail/entity/email.entity'

@ApiTags('mail')
@Controller('emailPush')
export class EmailController {
	constructor(private readonly mailService: EmailService) {}

	@Post('send')
	@ApiBody({ type: SendEmailDto })
	async sendMail(@Body() sendEmailDto: SendEmailDto) {
		return this.mailService.sendMail(sendEmailDto)
	}

	@Get('emailId')
	async findByEmail(
		@Param('mail') mail: string
	): Promise<emailEntity | null> {
		return await this.mailService.findByEmail(mail)
	}

	@Get('emailPush')
	async findAll(): Promise<emailEntity[] | null> {
		return await this.mailService.sendAllEmail()
	}
}

