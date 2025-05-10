import { Controller, Get, Param } from '@nestjs/common'
import { TestService } from './test.service'

@Controller('test')
export class TestController {
	constructor(private readonly appService: TestService) {}

	@Get()
	getHello(@Param('test') test: string): string {
		return this.appService.getHello()
	}
}
