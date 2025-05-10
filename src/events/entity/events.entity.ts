import {
	Column, CreateDateColumn,
	Entity, ManyToMany,
	PrimaryGeneratedColumn
} from 'typeorm'
import { userEntity } from '@/user/entity/user.entity'

@Entity('events')
export class eventsEntity {
	@PrimaryGeneratedColumn({ type: 'int' })
	id: number

	@Column({ type: 'nvarchar', length: 150 })
	name: string

	@Column({ type: 'nvarchar', length: 150 })
	description: string

	@ManyToMany(() => userEntity,
		(user) => user.events)
	user: userEntity[]

	@CreateDateColumn({ type: 'date' })
	dateCreate: Date
}
