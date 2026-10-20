import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { BaulService } from './baul.service';
import { CreateBaulDto } from '../dto/create-baul.dto';
import { AddAbonoDto } from '../dto/abono.dto';

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

  // --- COLOCA ESTA RUTA ANTES DE @Get(':id') ---
  @Patch(':id/abono')
  registrarAbono(
    @Param('id') id: string,
    @Body() addAbonoDto: AddAbonoDto,
  ) {
    return this.baulService.registrarAbono(id, addAbonoDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.baulService.findOne(id);
  }
}