import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as express from 'express'
import { join } from 'path'
import 'dotenv/config'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { logger } from '@/log'

async function bootstrap() {
	require ( 'dotenv' ) . config ( )

	const PORT = process.env.PORT || 5000
	const app = await NestFactory.create(AppModule)

	app.enableCors({ credentials: true, origin: true })
	app.useGlobalPipes(new ValidationPipe())

	app.use('/uploads', express.static(join(__dirname, '..', 'uploads')))

	const config = new DocumentBuilder()
		.setTitle('IT project API')
		.setVersion('1.1')
		.build()

	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('/api/docs', app, document)

	await app.listen(PORT, () => {
		logger.info('global', 'bootstrap-main', `App listening on port: ${PORT}`)
		console.log(`Server url: http://localhost:${PORT}/api/docs`)
	})
}
bootstrap()
