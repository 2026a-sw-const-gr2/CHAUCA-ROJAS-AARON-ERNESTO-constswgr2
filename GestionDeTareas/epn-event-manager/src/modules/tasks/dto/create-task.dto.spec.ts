import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';

describe('CreateTaskDto', () => {
  const validate_ = async (payload: Record<string, unknown>) => {
    const dto = plainToInstance(CreateTaskDto, payload);
    return validate(dto);
  };

  it('passes with a valid titulo', async () => {
    const errors = await validate_({ titulo: 'Tarea válida' });

    expect(errors).toHaveLength(0);
  });

  it('fails when titulo is empty', async () => {
    const errors = await validate_({ titulo: '' });

    expect(errors.some((e) => e.property === 'titulo')).toBe(true);
  });

  it('fails when titulo is only whitespace', async () => {
    const errors = await validate_({ titulo: '   ' });

    expect(errors.some((e) => e.property === 'titulo')).toBe(true);
  });

  it('fails when titulo is shorter than 3 characters', async () => {
    const errors = await validate_({ titulo: 'ab' });

    expect(errors.some((e) => e.property === 'titulo')).toBe(true);
  });

  it('fails when titulo exceeds 150 characters', async () => {
    const errors = await validate_({ titulo: 'a'.repeat(151) });

    expect(errors.some((e) => e.property === 'titulo')).toBe(true);
  });

  it('passes when titulo is exactly 150 characters', async () => {
    const errors = await validate_({ titulo: 'a'.repeat(150) });

    expect(errors).toHaveLength(0);
  });

  it('fails when descripcion exceeds 1000 characters', async () => {
    const errors = await validate_({
      titulo: 'Tarea válida',
      descripcion: 'a'.repeat(1001),
    });

    expect(errors.some((e) => e.property === 'descripcion')).toBe(true);
  });

  it('fails when estado is not one of the allowed values', async () => {
    const errors = await validate_({
      titulo: 'Tarea válida',
      estado: 'archivada',
    });

    expect(errors.some((e) => e.property === 'estado')).toBe(true);
  });
});
