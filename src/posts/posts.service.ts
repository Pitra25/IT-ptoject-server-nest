import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { postEntity } from '@/post/entity/post.entity'

@Injectable()
export class PostsService {
	constructor(
		@InjectRepository(postEntity)
		private postRepository: Repository<postEntity>
	) {}

}
