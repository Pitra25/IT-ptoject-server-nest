import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'

import { UserModule } from '@/user/user.module'
import { EmailModule } from '@/mail/email.module'
import { PostsModule } from '@/post/posts.module'
import { AuthModule } from './auth/auth.module'
import { OrganizationsModule } from './organizations/organizations.module'
import { EventsModule } from './events/events.module'
import { TestModule } from './test/test.module'

import { userEntity } from '@/user/entity/user.entity'
import { emailEntity } from '@/mail/entity/email.entity'
import { postEntity } from '@/post/entity/post.entity'
import { organizationsEntity } from '@/organizations/entity/organizations.entity'
import { eventsEntity } from '@/events/entity/events.entity'

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: `.env.development`
		}),
		UserModule,
		EmailModule,
		PostsModule,
		AuthModule,
		OrganizationsModule,
		EventsModule,
		TestModule,
		TypeOrmModule.forRoot({
			type: 'mysql',
			host: process.env.DB_HOST,
			port: Number(process.env.DB_PORT),
			username: process.env.DB_USERNAME,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
			entities: [
				userEntity,
				emailEntity,
				postEntity,
				organizationsEntity,
				eventsEntity
			],
			synchronize: false
		}),
		TypeOrmModule.forFeature([
			userEntity,
			emailEntity,
			postEntity,
			organizationsEntity,
			eventsEntity
		])
	]
})
export class AppModule {}
