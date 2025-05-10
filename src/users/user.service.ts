import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { JwtService } from '@nestjs/jwt'
import * as argon2 from 'argon2'

import { CreateUserDto } from '@/user/dto/createUser.dto'
import { userEntity } from './entity/user.entity'
import { organizationsEntity } from '@/organizations/entity/organizations.entity'
import { eventsEntity } from '@/events/entity/events.entity'
import { postEntity } from '@/post/entity/post.entity'

import { logger } from '@/log'
import { OrganizationsDto } from '@/organizations/dto/organizations.dto'

type UserResponse = {
	user: Promise<userEntity>
	token: string
}

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(userEntity)
		private usersRepository: Repository<userEntity>,

		@InjectRepository(organizationsEntity)
		private organizationsRepository: Repository<organizationsEntity>,

		@InjectRepository(eventsEntity)
		@InjectRepository(postEntity)

		private jwtService: JwtService,
	) {}

	async create(
		createUserDto: CreateUserDto,
		createOrganization: OrganizationsDto): Promise<UserResponse | undefined> {
		const userId: userEntity | null = await this.findOneName(createUserDto.name)
		if (userId == null) throw new BadRequestException('This email is already taken')

		let organization: organizationsEntity | null  = await this.findOrganizationIdByName(createUserDto.name)
		if (organization == null) {
			const newOrganization = await this.createOrganization(createOrganization)
			if(newOrganization == undefined) throw new BadRequestException('Failed to create organization')
			organization = newOrganization
		} else {
			throw new BadRequestException('This organization is already taken')
		}

		try {
			const newUser = new userEntity()
				newUser.name = createUserDto.name
				newUser.lastname = createUserDto.lastName
				newUser.patronymic = createUserDto.patronymic
				newUser.passwordHash = await argon2.hash(createUserDto.passwordHash as string)
				newUser.organization = organization
				newUser.isAdmin = createUserDto.email === process.env.MAIL_ADMIN

			const user: userEntity = this.usersRepository.create(newUser)
			const userSave: Promise<userEntity> = this.usersRepository.save(user)

			const payload = { email: createUserDto.email, userName: createUserDto.name }
			const token = await this.jwtService.signAsync(payload, { secret: process.env.JWT_SECRET })

			let fio: string = `${createUserDto.passwordHash} ${createUserDto.name.charAt(0)}.`
			if(createUserDto.surname != "") fio += ` ${createUserDto.surname.charAt(0)}.`

			logger.info('user', 'user-UserService', `User created: ${fio}`)

			return {
				user: {...userSave},
				token: token
			}
		} catch (error) {
			logger.error('user', 'user-UserService', 'Error create user: ', {error})
		}
	}

	async getAllUsers(): Promise<userEntity[]> {
		return await this.usersRepository.find()
	}
	async findBuId(id: number): Promise<userEntity | null> {
		logger.info('user', 'UserService', 'Search user id: ' + id)
		return await this.usersRepository.findOne({ where: { id } })
	}
	async findOneEmail(email: string): Promise<userEntity | null> {
		return await this.usersRepository.findOne({ where: { email } })
	}
	async findOneName(name: string): Promise<userEntity | null> {
		return await this.usersRepository.findOne({ where: { name } })
	}
	async findUserIdByName (name: string): Promise<userEntity | null>  {
		return await this.usersRepository.findOne({ where: { name } })
	}
	async findOrganizationIdByName (name: string): Promise<organizationsEntity | null>  {
		return await this.organizationsRepository.findOne({ where: { name } })
	}

	async createOrganization(
		createOrganizationDto: OrganizationsDto
	): Promise<organizationsEntity | undefined> {
		if (!createOrganizationDto) return undefined

		try {
			const newOrganization = new organizationsEntity()
			newOrganization.name = createOrganizationDto.name
			newOrganization.address = createOrganizationDto.address
			newOrganization.users = []
			newOrganization.dateCreate = new Date()

			const organization: organizationsEntity =
				this.organizationsRepository.create(newOrganization)

			logger.info('user', 'user-createOrganization', `User created: ${organization}`)

			return this.usersRepository.save(organization)
		}catch(error){
			logger.error('user', 'user-createOrganization', 'Error create organization ', {error})
			return undefined
		}
	}
}
