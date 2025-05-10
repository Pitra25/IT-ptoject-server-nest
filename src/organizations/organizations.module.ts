import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OrganizationsService } from './organizations.service'
import { OrganizationsController } from './organizations.controller'
import { organizationsEntity } from '@/organizations/entity/organizations.entity'
import { userEntity } from '@/user/entity/user.entity'

@Module({
    imports: [
        TypeOrmModule.forFeature([
            organizationsEntity,
            userEntity,
        ])
    ],
    providers: [OrganizationsService],
    controllers: [OrganizationsController],
    exports: [
        TypeOrmModule.forFeature([organizationsEntity]),
        OrganizationsService,
    ],
})
export class OrganizationsModule {}
