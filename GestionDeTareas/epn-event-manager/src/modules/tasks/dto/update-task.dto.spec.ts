import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateTaskDto } from './update-task.dto';

describe('UpdateTaskDto', () => {
  const validate_ = async (payload: Record<string, unknown>) => {
    const dto = plainToInstance(UpdateTaskDto, payload);
    return validate(dto);
  };

  it('passes with an empty payload since all fields are optional', async () => {
    const errors = await validate_({});

    expect(errors).toHaveLength(0);
  });

  it('passes with a valid titulo', async () => {
    const errors = await validate_({ titulo: 'Tarea actualizada' });

    expect(errors).toHaveLength(0);
  });

  it('fails when titulo is provided but empty', async () => {
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

  it('fails when descripcion exceeds 1000 characters', async () => {
    const errors = await validate_({ descripcion: 'a'.repeat(1001) });

    expect(errors.some((e) => e.property === 'descripcion')).toBe(true);
  });
});
