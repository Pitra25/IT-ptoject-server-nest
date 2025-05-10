import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { organizationsEntity } from '@/organizations/entity/organizations.entity'
import { userEntity } from '@/user/entity/user.entity'

@Injectable()
export class OrganizationsService {
	constructor(
		@InjectRepository(organizationsEntity)
		private organizationsRepository: Repository<organizationsEntity>,
		@InjectRepository(userEntity)
		private usersRepository: Repository<userEntity>,
	) {}
}
