import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Community } from '../../src/comunidades/entities/comunidade.schema';
import { ComunidadesController } from '../../src/comunidades/comunidades.controller';
import { ComunidadesService } from '../../src/comunidades/comunidades.service';
import { UserRelation } from '../../src/comunidades/entities/userRelation.schema';

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
        {
          provide: getModelToken(UserRelation.name),
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

  it('should add a user to a community', async () => {
    const userRelation: any = {
      userId: '1234',
      communityId: '4321',
    };

    const module = await customModule({
      addUser: () => ({
        id: '999',
        ...userRelation,
      }),
    });

    controller = module.get<ComunidadesController>(ComunidadesController);

    expect(await controller.addUser(userRelation)).toStrictEqual({
      communityId: '4321',
      id: '999',
      userId: '1234',
    });
  });

  it('should get all users of a community', async () => {
    const userRelations: any = [
      {
        id: '1',
        userId: '1234',
        communityId: '4321',
      },
      {
        id: '2',
        userId: '1235',
        communityId: '4321',
      },
      {
        id: '3',
        userId: '1236',
        communityId: '4321',
      },
    ];

    const module = await customModule({
      getUsers: (communityId: string) => {
        return userRelations.filter((element) => {
          return communityId === element.communityId;
        });
      },
    });

    controller = module.get<ComunidadesController>(ComunidadesController);

    expect(await controller.getUsers('4321')).toStrictEqual(userRelations);
  });

  it('should remove users of a community', async () => {
    const userRelations: any = [
      {
        id: '1',
        userId: '1234',
        communityId: '4321',
      },
      {
        id: '2',
        userId: '1235',
        communityId: '4321',
      },
      {
        id: '3',
        userId: '1236',
        communityId: '4321',
      },
    ];

    const userRelationToRemove: any = {
      userId: '1234',
      communityId: '4321',
    };

    const module = await customModule({
      removeUser: (userRelation) => {
        userRelations.splice(
          userRelations.indexOf(
            userRelations.filter((element) => {
              return (
                userRelation.communityId === element.communityId &&
                userRelation.userId === element.userId
              );
            }),
          ),
          1,
        );
      },
    });

    controller = module.get<ComunidadesController>(ComunidadesController);

    await controller.removeUser(userRelationToRemove);

    expect(userRelations).not.toContain({
      id: '1',
      userId: '1234',
      communityId: '4321',
    });
  });

  it('should get a user from a community', async () => {
    const userRelations: any = [
      {
        id: '1',
        userId: '1234',
        communityId: '4321',
      },
      {
        id: '2',
        userId: '1235',
        communityId: '4321',
      },
      {
        id: '3',
        userId: '1236',
        communityId: '4321',
      },
    ];

    const userRelationToFind: any = {
      userId: '1234',
      communityId: '4321',
    };

    const module = await customModule({
      getCommunityUser: (userRelation) => {
        return userRelations.filter((element) => {
          return (
            userRelation.communityId === element.communityId &&
            userRelation.userId === element.userId
          );
        })[0];
      },
    });

    controller = module.get<ComunidadesController>(ComunidadesController);

    expect(await controller.getCommunityUser(userRelationToFind)).toStrictEqual(
      {
        id: '1',
        userId: '1234',
        communityId: '4321',
      },
    );
  });
});
