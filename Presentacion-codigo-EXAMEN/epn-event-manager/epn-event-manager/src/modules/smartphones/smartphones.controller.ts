import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';
import { CreateSmartphoneDto } from './dto/create-smartphone.dto';
import { UpdateSmartphoneDto } from './dto/update-smartphone.dto';
import { SmartphonesService } from './smartphones.service';

// Antes: endpoints públicos sin ninguna protección
// Ahora: todos los endpoints requieren header X-FIS-EPN-KEY via ApiKeyGuard
@ApiTags('Smartphones')
@ApiSecurity('x-fis-epn-key')
@UseGuards(ApiKeyGuard)
@Controller('api/smartphones')
export class SmartphonesController {
  constructor(private readonly smartphonesService: SmartphonesService) {}

  @Post()
  create(@Body() dto: CreateSmartphoneDto) {
    return this.smartphonesService.create(dto);
  }

  @Get()
  findAll() {
    return this.smartphonesService.findAll();
  }

  // Antes: Number(id) sin validación, NaN llegaba al service
  // Ahora: ParseIntPipe rechaza con 400 cualquier valor que no sea entero
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.smartphonesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSmartphoneDto) {
    return this.smartphonesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.smartphonesService.remove(id);
  }
}
