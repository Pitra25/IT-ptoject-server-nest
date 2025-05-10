import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { EmailController } from './email.controller'
import { EmailService } from './email.service'
import { emailEntity } from './entity/email.entity'

@Module({
	imports: [
		TypeOrmModule.forFeature([emailEntity])
	],
	controllers: [EmailController],
	providers: [EmailService]
})
export class EmailModule {}
