import {
	Column, CreateDateColumn,
	Entity, ManyToMany, OneToMany,
	PrimaryGeneratedColumn
} from 'typeorm'
import { organizationsEntity } from '@/organizations/entity/organizations.entity'
import { eventsEntity } from '@/events/entity/events.entity'
import { postEntity } from '@/post/entity/post.entity'

@Entity('users')
export class userEntity {
	@PrimaryGeneratedColumn({ type: 'smallint' })
	id: number

	@Column({ type: 'nvarchar', length: 150 })
	name: string

	@Column({ type: 'nvarchar', length: 150 })
	lastname: string

	@Column({ type: 'nvarchar', length: 150 })
	patronymic: string

	@Column({ type: 'varchar', length: 500 })
	passwordHash: string

	@Column({ type: 'nvarchar', length: 150 })
	email: string

	@OneToMany(() => organizationsEntity,
		(organization) => organization.users)
	organization: organizationsEntity

	@ManyToMany(() => eventsEntity,
		(events) => events.user)
	events: eventsEntity[]

	@ManyToMany(() => postEntity,
		(post) => post.user)
	posts: postEntity[]

	@Column({ type: 'boolean' })
	isAdmin: boolean

	@CreateDateColumn({ type: 'date' })
	dateCreate: Date

}
