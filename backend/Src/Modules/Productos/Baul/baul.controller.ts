import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BaulService } from './baul.service';
import { CreateBaulDto } from '../dto/create-baul.dto';

@Controller('baul')
export class BaulController {
  constructor(private readonly baulService: BaulService) {}

  @Post()
  create(@Body() createBaulDto: CreateBaulDto) {
    return this.baulService.create(createBaulDto);
  }

  @Get()
  findAll() {
    return this.baulService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.baulService.findOne(id);
  }
}