import nodemailer from 'nodemailer'

// const transporter_Gmail = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'login@gmail.com',
//         pass: 'pass'
//     }
// })

// const transporter_Mail = nodemailer.createTransport({
//     host: 'smtp.mail.ru',
//     port: 465,
//     secure: true,
//     auth: {
//         user: 'login',
//         pass: 'pass'
//     }
// })

export const useEmail = async () => {
	try {
		const transporter_Yandex = nodemailer.createTransport({
			service: 'yandex',
			auth: {
				user: ' v.akulowitch@yandex.ru',
				pass: 'b5066b3392981c1db4423c760139663b'
			}
		})
		const mailOptions = {
			from: ' v.akulowitch@yandex.ru',
			to: 'Pitra25@yandex.ru',
			subject: 'Hello World!',
			html: `
            <h1>Hello?</h1>
            <p>How are you?</p>
          `
		}

		const send = () => {
			return new Promise((resolve, reject) => {
				transporter_Yandex.sendMail(mailOptions, (error, info) => {
					if (error) {
						reject(error)
					}
					resolve(info)
				})
			})
		}

		await send()

		return console.log('Отправлено')
	} catch (e) {
		console.error(e)
	}
}

// import { ConfigService } from '@nestjs/config'
// import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter'
//
// type SenderType = 'yandex' | 'mail' | 'gmail'
//
// export const getMailConfig = async (
// 	configService: ConfigService,
// 	type: SenderType
// ): Promise<any> => {
// 	const transport: string | undefined = configService.get<string>(
// 		type == 'yandex' ? 'YANDEX_TRANSPORT' :
// 			type == 'mail' ? 'MAIL_TRANSPORT' :
// 				type == 'gmail' ? 'GMAIL_TRANSPORT' : ''
// 	)
// 	if (transport == undefined) {return }
// 	const mailFromName: string | undefined   = configService.get<string>('MAIL_FROM_NAME')
// 	const mailFromAddress: string = transport.split(':')[1].split('//')[1]
//
// 	return {
// 		transport,
// 		defaults: {
// 			from: `"${mailFromName}" <${mailFromAddress}>`,
// 		},
// 		template: {
// 			adapter: new EjsAdapter(),
// 			options: {
// 				strict: false,
// 			},
// 		},
// 	}
// }
