import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { userEntity } from '@/user/entity/user.entity'
import { eventsEntity } from '@/events/entity/events.entity'

import { EventsService } from '@/events/events.service'
import { EventsController } from '@/events/events.controller'

@Module({
	imports: [
		TypeOrmModule.forFeature([
			userEntity,
			eventsEntity,
		])
	],
	providers: [EventsService],
	controllers: [EventsController],
	exports: [
		TypeOrmModule.forFeature([eventsEntity]),
		EventsService,
	],
})
export class EventsModule {}
