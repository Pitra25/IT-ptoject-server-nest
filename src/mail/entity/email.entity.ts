import {
	Column, CreateDateColumn,
	Entity, PrimaryGeneratedColumn
} from 'typeorm'

@Entity('emails')
export class emailEntity {
	@PrimaryGeneratedColumn({ type: 'int' })
	id: number

	@Column({ type: 'nvarchar', length: 150 })
	senderName: string

	@Column({ type: 'nvarchar', length: 150 })
	senderLastName: string

	@Column({ type: 'nvarchar', length: 250 })
	senderEmail: string

	@Column({ type: 'mediumtext' })
	senderMessage: string

	@CreateDateColumn({ type: 'date' })
	departureDate: Date
}
