import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'

import { UserController } from '@/user/user.controller'
import { UserService } from '@/user/user.service'
import { userEntity } from './entity/user.entity'

import { PostsModule } from '@/post/posts.module'
import { EventsModule } from '@/events/events.module'
import { OrganizationsModule } from '@/organizations/organizations.module'
import { postEntity } from '@/post/entity/post.entity'
import { eventsEntity } from '@/events/entity/events.entity'
import { organizationsEntity } from '@/organizations/entity/organizations.entity'

@Module({
	imports: [
		PostsModule,
		EventsModule,
		OrganizationsModule,
		TypeOrmModule.forFeature([
			userEntity,
			postEntity,
			eventsEntity,
			organizationsEntity
		]),
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: process.env.JWT_SAVE },
			global: true
		}),
	],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService]
})
export class UserModule {}
