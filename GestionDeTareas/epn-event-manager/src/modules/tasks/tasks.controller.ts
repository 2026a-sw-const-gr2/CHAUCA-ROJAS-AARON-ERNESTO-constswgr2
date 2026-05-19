/**
 * Problema 12 — Mantenimiento Perfectivo
 * Qué: El HTML, CSS y JS de la vista UI estaban incrustados directamente aquí.
 * Mejora: La capa de presentación se extrajo a src/modules/tasks/views/tasks.html.
 *         El controlador ahora solo lee y sirve ese archivo.
 * Por qué: Separar presentación de lógica mejora la mantenibilidad: los cambios
 *           de UI no requieren modificar ni recompilar el controlador.
 * Tipo: Perfectivo.
 */
import { readFileSync } from 'fs';
import { join } from 'path';

import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  /**
   * Problema 12 — Perfectivo:
   * Antes: retornaba un template literal de >150 líneas con HTML/CSS/JS.
   * Ahora: lee el archivo views/tasks.html y lo sirve.
   * __dirname apunta a src/modules/tasks en dev y a dist/modules/tasks en prod,
   * por lo que la ruta relativa './views/tasks.html' funciona en ambos entornos.
   */
  @Get('ui')
  @Header('Content-Type', 'text/html')
  getTasksPage(): string {
    return readFileSync(join(__dirname, 'views', 'tasks.html'), 'utf-8');
  }

  @Post()
  create(@Body() dto: CreateTaskDto) {
    return this.tasksService.create(dto);
  }

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(Number(id));
  }
}
