import { organizationsEntity } from '@/organizations/entity/organizations.entity'

export interface User {
	name: string
	surname: string
	patronymic: string
	passwordHash: string
	email: string
	organizationId: organizationsEntity
	isAdmin: boolean
	dateCreate: Date
}