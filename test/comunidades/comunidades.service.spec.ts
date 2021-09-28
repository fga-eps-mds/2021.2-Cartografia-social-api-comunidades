import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Community } from '../../src/comunidades/entities/comunidade.schema';
import { ComunidadesService } from '../../src/comunidades/comunidades.service';
import { MicrosserviceException } from '../../src/commons/exceptions/MicrosserviceException';
import { UserRelation } from '../../src/comunidades/entities/userRelation.schema';

describe('ComunidadesService', () => {
  let service: ComunidadesService;

  const customModule = (
    fnCommunity: any,
    fnUserRelation: any,
    fnUserAdminRelation: any,
  ) => {
    return Test.createTestingModule({
      providers: [
        ComunidadesService,
        {
          provide: getModelToken(Community.name),
          useValue: fnCommunity,
        },
        {
          provide: getModelToken(UserRelation.name),
          useValue: fnUserRelation,
        },
        {
          provide: getModelToken('userAdminRelation'),
          useValue: fnUserAdminRelation,
        },
      ],
    }).compile();
  };

  it('should be defined', async () => {
    const module: TestingModule = await customModule(
      jest.fn(),
      jest.fn(),
      jest.fn(),
    );

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
      jest.fn(),
      jest.fn(),
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
        this.save = () => Promise.reject(new Error('erro'));
      },
      jest.fn(),
      jest.fn(),
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

    const module: TestingModule = await customModule(
      {
        findById: () => community,
      },
      jest.fn(),
      jest.fn(),
    );

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

    const module: TestingModule = await customModule(
      {
        findById: () => community,
      },
      jest.fn(),
      jest.fn(),
    );

    service = module.get<ComunidadesService>(ComunidadesService);

    expect(await service.getById('123')).toStrictEqual(community);
  });

  it('should fail to get a community', async () => {
    const module: TestingModule = await customModule(
      {
        findById: () => undefined,
      },
      jest.fn(),
      jest.fn(),
    );

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

    const module: TestingModule = await customModule(
      {
        findById: () => community,
      },
      jest.fn(),
      jest.fn(),
    );

    service = module.get<ComunidadesService>(ComunidadesService);
    expect(await service.destroy('123')).toBeUndefined();
  });

  it('should delete a user from community', async () => {
    const userRelation = {
      id: '1',
      userId: '1236',
      communityId: '123',
      delete: async () => undefined,
    };

    const module: TestingModule = await customModule(
      {
        getCommunityUser: async () => userRelation,
      },
      {
        findOne: async () => userRelation,
      },
      jest.fn(),
    );

    service = module.get<ComunidadesService>(ComunidadesService);

    expect(
      await service.removeUser({ userId: '1236', communityId: '123' }),
    ).toBeUndefined();
  });

  it('should find users from a community', async () => {
    const community = {
      id: '123',
      name: 'Por do sol',
      description: 'Comunidade pôr do sol',
      imageUrl: null,
    };

    const userRelation = [
      {
        id: '1',
        userId: '1236',
        communityId: '123',
      },
      {
        id: '3',
        userId: '1235',
        communityId: '123',
      },
    ];

    const module: TestingModule = await customModule(
      {
        findById: () => Promise.resolve(community),
      },
      {
        find: async () => userRelation,
      },
      jest.fn(),
    );

    service = module.get<ComunidadesService>(ComunidadesService);

    expect(await service.getUsers('123')).toStrictEqual(userRelation);
  });

  it('should create a communityUser', async () => {
    const community = {
      id: '123',
      name: 'Por do sol',
      description: 'Comunidade pôr do sol',
      imageUrl: null,
    };
    const id = '321';
    const userDto = { userId: '1236', communityId: '123' };

    const module: TestingModule = await customModule(
      {
        findById: () => Promise.resolve(community),
      },
      function mockSurveyResponseModel(dto: any) {
        this.data = dto;
        this.save = () => {
          this.data.id = id;
          return this.data;
        };
      },
      jest.fn(),
    );

    service = module.get<ComunidadesService>(ComunidadesService);

    expect(await service.addUser(userDto)).toStrictEqual({
      userId: '1236',
      communityId: '123',
      id,
    });
  });

  it('should failt to create a communityUser', async () => {
    const community = {
      id: '123',
      name: 'Por do sol',
      description: 'Comunidade pôr do sol',
      imageUrl: null,
    };

    const userDto = { userId: '1236', communityId: '123' };

    const module: TestingModule = await customModule(
      {
        findById: () => Promise.resolve(community),
      },
      function mockSurveyResponseModel(dto: any) {
        this.data = dto;
        this.save = () => Promise.reject(new Error('erro'));
      },
      jest.fn(),
    );

    service = module.get<ComunidadesService>(ComunidadesService);

    try {
      await service.addUser(userDto);
    } catch (error) {
      expect(error).toBeInstanceOf(MicrosserviceException);
    }
  });
});
