import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Community } from '../../src/comunidades/entities/comunidade.schema';
import { ComunidadesService } from '../../src/comunidades/comunidades.service';
import { MicrosserviceException } from '../../src/commons/exceptions/MicrosserviceException';
import { UserRelation } from '../../src/comunidades/entities/userRelation.schema';

describe('ComunidadesService', () => {
  let service: ComunidadesService;

  const customModule = (fn: any) => {
    return Test.createTestingModule({
      providers: [
        ComunidadesService,
        {
          provide: getModelToken(Community.name),
          useValue: fn,
        },
        {
          provide: getModelToken(UserRelation.name),
          useValue: jest.fn(),
        },
      ],
    }).compile();
  };

  it('should be defined', async () => {
    const module: TestingModule = await customModule(jest.fn());

    service = module.get<ComunidadesService>(ComunidadesService);

    expect(service).toBeDefined();
  });

  it('should create a community with sucess', async () => {
    const id = '123';
    const module: TestingModule = await customModule(
      function mockSurveyResponseModel(dto: any) {
        this.data = dto;
        this.save = () => {
          this.data.id = id;
          return this.data;
        };
      },
    );

    service = module.get<ComunidadesService>(ComunidadesService);

    expect(
      await service.create({
        name: 'Por do sol',
        description: 'Comunidade pôr do sol',
        imageUrl: null,
      }),
    ).toStrictEqual({
      id,
      name: 'Por do sol',
      description: 'Comunidade pôr do sol',
      imageUrl: null,
    });
  });

  it('should fail to create a community', async () => {
    const module: TestingModule = await customModule(
      function mockSurveyResponseModel(dto: any) {
        this.data = dto;
        this.save = () => new Error('erro');
      },
    );

    service = module.get<ComunidadesService>(ComunidadesService);

    try {
      await service.create({
        name: 'Por do sol',
        description: 'Comunidade pôr do sol',
        imageUrl: null,
      });
    } catch (error) {
      expect(error.message).toBe('erro');
      expect(error).toBeInstanceOf(MicrosserviceException);
    }
  });

  it('should update a community with sucess', async () => {
    const community = {
      id: '123',
      name: 'Por do sol',
      description: 'Comunidade pôr do sol',
      imageUrl: null,
      save: function () {
        return {
          id: this.id,
          name: this.name,
          description: this.description,
          imageUrl: this.imageUrl,
        };
      },
    };

    const module: TestingModule = await customModule({
      findById: () => community,
    });

    service = module.get<ComunidadesService>(ComunidadesService);

    expect(
      await service.update({
        id: '123',
        imageUrl: 'http://image.url',
        description: 'nova descrição',
      }),
    ).toStrictEqual({
      id: '123',
      name: 'Por do sol',
      description: 'nova descrição',
      imageUrl: 'http://image.url',
    });
  });

  it('should get a community with sucess', async () => {
    const community = {
      id: '123',
      name: 'Por do sol',
      description: 'Comunidade pôr do sol',
      imageUrl: null,
    };

    const module: TestingModule = await customModule({
      findById: () => community,
    });

    service = module.get<ComunidadesService>(ComunidadesService);

    expect(await service.getById('123')).toStrictEqual(community);
  });

  it('should fail to get a community', async () => {
    const module: TestingModule = await customModule({
      findById: () => undefined,
    });

    service = module.get<ComunidadesService>(ComunidadesService);

    try {
      await service.getById('123');
    } catch (error) {
      expect(error).toBeInstanceOf(MicrosserviceException);
    }
  });

  it('should destroy a community', async () => {
    const community = {
      id: '123',
      name: 'Por do sol',
      description: 'Comunidade pôr do sol',
      imageUrl: null,
      delete: () => undefined,
    };

    const module: TestingModule = await customModule({
      findById: () => community,
    });

    service = module.get<ComunidadesService>(ComunidadesService);
    expect(await service.destroy('123')).toBeUndefined();
  });

  it('should get users from a community', async () => {
    const community = {
      id: '123',
      name: 'Por do sol',
      description: 'Comunidade pôr do sol',
      imageUrl: null,
      delete: () => undefined,
    };

    const userRelations: any = [
      {
        id: '1',
        userId: '1234',
        communityId: '123',
      },
      {
        id: '2',
        userId: '1235',
        communityId: '123',
      },
      {
        id: '3',
        userId: '1236',
        communityId: '123',
      },
    ];

    const module: TestingModule = await customModule({
      getUsers: (communityId: string) => {
        return userRelations.filter((element) => {
          return element.communityId == communityId;
        });
      },
      findById: () => community,
    });

    service = module.get<ComunidadesService>(ComunidadesService);
    expect(await service.getUsers('123')).toStrictEqual(userRelations);
  });
});
