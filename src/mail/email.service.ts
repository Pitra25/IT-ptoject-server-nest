import {
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as nodemailer from 'nodemailer'
import * as handlebars from 'handlebars'
import path, { join } from 'path'
import fs from 'fs'

import { SendEmailDto } from './dto/send-email.dto'
import { emailEntity } from './entity/email.entity'

import { logger } from '@/log'

@Injectable()
export class EmailService {

	private transporter: nodemailer.Transporter
	constructor(
		@InjectRepository(emailEntity)
		private emailRepository: Repository<emailEntity>
	) {
		this.transporter = nodemailer.createTransport({
			host: 'smtp.yandex.ru',
			port: 465,
			secure: true, // if false - port: 465
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS
			}
		})
	}

	async sendMail(
		sendEmailDto: SendEmailDto,
	) {
		if (
			sendEmailDto.message.senderName == '' ||
			sendEmailDto.message.senderLastName == '' ||
			sendEmailDto.message.senderEmail == '' ||
			sendEmailDto.message.senderMessage == ''
		) {
			logger.error('email', 'EmailService-sendMail', 'The fields in the feedback request were not filled.', {sendEmailDto})
			throw new UnauthorizedException('Required fields are not filled in')
		}

		const currentDate = new Date().toLocaleString('ru-RU', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		})

		const newMessage: emailEntity = await this.saveMail(sendEmailDto)

		let template:
			| HandlebarsTemplateDelegate<any>
			| ((arg0: {
					userName: string
					userEmail: string
					messageContent: string
					currentDate: string
					currentYear: number
			  }) => any)
		try {
			// const templatePath = './templates/notification.hbs'
			// const templatePath = path.join(__dirname, '/templates/notification.hbs')
			// const templatePath = process.cwd() + '/src/mail/templates/notification.hbs'
			const templatePath = join(__dirname, '..', 'templates', 'notification.hbs')
			const templateSource = fs.readFileSync(templatePath, 'utf8')
			template = handlebars.compile(templateSource)

		} catch (error){
			logger.error('email', 'EmailService-sendMail',  'Error getting path to email template', {error})
			throw new UnauthorizedException('Required fields are not filled in')
		}

		const html = template({
			userName: sendEmailDto.message.senderName,
			userEmail: sendEmailDto.message.senderEmail,
			messageContent: sendEmailDto.message.senderMessage,
			currentDate,
			currentYear: new Date().getFullYear(),
		})

		const { to, subject, text } = sendEmailDto
		const mailOptions = {
			from: `It-project ${process.env.EMAIL_FROM}`,
			to,
			subject,
			text,
			html
		}

		try {
			await this.transporter.sendMail(mailOptions)

			logger.info('email', 'EmailService' ,`The letter was sent from ${newMessage.senderName}`)
			return { ...newMessage }
		} catch (error) {
			logger.error('email', 'EmailService', `No push email found. error text: ${error}`)
			return `No push email found. \n error text: ${error}`
		}
	}

	async sendAllEmail(): Promise<emailEntity[] | null> {
		return await this.emailRepository.find()
	}
	async findByEmail(senderEmail: string): Promise<emailEntity | null> {
		return await this.emailRepository.findOne({
			where: { senderEmail }
		})
	}

	async saveMail(sendEmailDto: SendEmailDto): Promise<emailEntity> {

		const newMessage = new emailEntity()
		newMessage.senderName = sendEmailDto.message.senderName
		newMessage.senderLastName = sendEmailDto.message.senderLastName
		newMessage.senderEmail = sendEmailDto.message.senderEmail
		newMessage.senderMessage = sendEmailDto.message.senderMessage
		newMessage.departureDate = sendEmailDto.message.dateCreate

		try {
			const message= this.emailRepository.create(newMessage)
			return this.emailRepository.save(message)
		} catch (error) {
			logger.error('email', 'EmailService-sendMail', 'Error saving letter', {error})
			throw new UnauthorizedException(error)
		}
	}
}
