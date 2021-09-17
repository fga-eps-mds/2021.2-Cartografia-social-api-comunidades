import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Community } from '../../src/comunidades/entities/comunidade.schema';
import { ComunidadesController } from '../../src/comunidades/comunidades.controller';
import { ComunidadesService } from '../../src/comunidades/comunidades.service';

describe('ComunidadesController', () => {
  let controller: ComunidadesController;

  const customModule = (fn: any) => {
    return Test.createTestingModule({
      providers: [
        {
          provide: ComunidadesService,
          useValue: fn,
        },
        {
          provide: getModelToken(Community.name),
          useValue: jest.fn(),
        },
      ],
      controllers: [ComunidadesController],
    }).compile();
  };

  it('should be defined', async () => {
    const module = await customModule(jest.fn());

    controller = module.get<ComunidadesController>(ComunidadesController);

    expect(controller).toBeDefined();
  });

  it('should create a community', async () => {
    const community: any = {
      name: 'Por do sol',
      description: 'Comunidade pôr do sol',
    };

    const module = await customModule({
      create: () => ({
        id: '123',
        ...community,
      }),
    });

    controller = module.get<ComunidadesController>(ComunidadesController);

    expect(
      await controller.create({
        name: 'Por do sol',
        description: 'Comunidade pôr do sol',
      }),
    ).toStrictEqual('123');
  });

  it('should update a community', async () => {
    const community = {
      id: '123',
      name: 'Por do sol',
      description: 'Comunidade pôr do sol',
    };

    const module = await customModule({
      update: () => community,
    });

    controller = module.get<ComunidadesController>(ComunidadesController);

    expect(
      await controller.update({
        id: '123',
        name: 'Por do sol',
        description: 'Comunidade pôr do sol',
      }),
    ).toStrictEqual('123');
  });

  it('should get a community', async () => {
    const community = {
      id: '123',
      name: 'Por do sol',
      description: 'Comunidade pôr do sol',
      toJSON: function () {
        return this;
      },
    };

    const module = await customModule({
      getById: () => community,
    });

    controller = module.get<ComunidadesController>(ComunidadesController);

    expect(await controller.get('123')).toStrictEqual(community);
  });

  it('should delete a community', async () => {
    const module = await customModule({
      destroy: () => true,
    });

    controller = module.get<ComunidadesController>(ComunidadesController);

    expect(await controller.delete('123')).toBe(true);
  });
});
