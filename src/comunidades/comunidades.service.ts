import { Injectable } from '@nestjs/common';

@Injectable()
export class ComunidadesService {
  create(id: string) {
    return `This action adds a new comunidade with id ${id}`;
  }
}
