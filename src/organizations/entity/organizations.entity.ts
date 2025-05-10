import {
	Column, CreateDateColumn,
	Entity, PrimaryGeneratedColumn,
	OneToMany
} from 'typeorm'
import { userEntity } from '@/user/entity/user.entity'

@Entity('organizations')
export class organizationsEntity {
	@PrimaryGeneratedColumn({ type: 'smallint' })
	id: number

	@Column({ type: 'nvarchar', length: 150 })
	name: string

	@Column({ type: 'nvarchar', length: 150 })
	address: string

	@CreateDateColumn({ type: 'date' })
	dateCreate: Date

	@OneToMany(() => userEntity,
		(user) => user.organization)
	users: userEntity[]
}
