import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { userEntity } from '@/user/entity/user.entity'
import { eventsEntity } from '@/events/entity/events.entity'

@Injectable()
export class EventsService {
	constructor(
		@InjectRepository(eventsEntity)
		private eventsRepository: Repository<eventsEntity>,
		@InjectRepository(userEntity)
		private usersRepository: Repository<userEntity>,
	) {}

}
