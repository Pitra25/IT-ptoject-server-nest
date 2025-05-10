import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PostsController } from './posts.controller'
import { PostsService } from './posts.service'
import { postEntity } from '@/post/entity/post.entity'

@Module({
  imports: [TypeOrmModule.forFeature([postEntity])],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [TypeOrmModule.forFeature([postEntity])],
})
export class PostsModule {}
