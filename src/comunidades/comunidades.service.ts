import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MicrosserviceException } from '../commons/exceptions/MicrosserviceException';
import { CommunityUserDto } from './dto/communityUser.dto';
import { CreateCommunityDto } from './dto/createCommunity.dto';
import { UpdateCommunityDto } from './dto/updateCommunity.dto';
import { UserDto } from './dto/user.dto';
import { Community, CommunityDocument } from './entities/comunidade.schema';
import { User, UserDocument } from './entities/user.schema';
import {
  UserRelation,
  UserRelationDocument,
} from './entities/userRelation.schema';

import tokml = require('@maphubs/tokml');
import { AreaDto } from './dto/areaCommunity.dto';

@Injectable()
export class ComunidadesService {
  constructor(
    @InjectModel(Community.name)
    private communityModel: Model<CommunityDocument>,
    @InjectModel(UserRelation.name)
    private userRelationModel: Model<UserRelationDocument>,
    @InjectModel('userAdminRelation')
    private userAdminRelationModel: Model<UserRelationDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async create(communityData: CreateCommunityDto) {
    const community = new this.communityModel(communityData);

    try {
      return await community.save();
    } catch (err) {
      throw new MicrosserviceException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async update(updateCommunity: UpdateCommunityDto) {
    const community = await this.getById(updateCommunity.id);

    if (updateCommunity.name) community.name = updateCommunity.name;
    if (updateCommunity.description)
      community.description = updateCommunity.description;
    if (updateCommunity.imageUrl) community.imageUrl = updateCommunity.imageUrl;

    return community.save();
  }

  async destroy(id: string) {
    const community = await this.getById(id);

    return community.delete();
  }

  async getById(id: string) {
    const community = await this.communityModel.findById(id);

    if (!community)
      throw new MicrosserviceException(
        'Comunidade não encontrada',
        HttpStatus.NOT_FOUND,
      );

    return community;
  }

  async getUsers(communityId: string) {
    const community = await this.getById(communityId);

    return this.userRelationModel.find({ communityId: community.id });
  }

  async getAdminUsers(communityId: string) {
    const community = await this.getById(communityId);

    return this.userAdminRelationModel.find({ communityId: community.id });
  }

  async addUser(communityUser: CommunityUserDto) {
    // don't catch and rethrow exception here, as the intention is
    // to let it go back to the gateway
    await this.getById(communityUser.communityId);

    const relation = new this.userRelationModel(communityUser);

    try {
      return await relation.save();
    } catch (err) {
      throw new MicrosserviceException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getCommunityUser(communityUser: CommunityUserDto) {
    const communityUserDoc = await this.userRelationModel.findOne({
      communityId: communityUser.communityId,
      userId: communityUser.userId,
    });

    if (!communityUserDoc)
      throw new MicrosserviceException(
        'usuário da comunidade não encontrado',
        HttpStatus.NOT_FOUND,
      );

    return communityUserDoc;
  }

  async removeUser(communityUser: CommunityUserDto) {
    // ignore exception on catch, this happens when user
    // was not an admin

    try {
      await this.removeAdminUser(communityUser);
    } catch {}

    const communityUserDoc = await this.getCommunityUser(communityUser);
    return communityUserDoc.delete();
  }

  async addAdminUser(communityAdminUser: CommunityUserDto) {
    // don't catch and rethrow exception here, as the intention is
    // to let it go back to the gateway
    await this.getCommunityUser(communityAdminUser);

    const relation = new this.userAdminRelationModel(communityAdminUser);

    try {
      return await relation.save();
    } catch (err) {
      throw new MicrosserviceException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getCommunityAdminUser(communityAdminUser: CommunityUserDto) {
    const communityAdminUserDoc = this.userAdminRelationModel.findOne({
      communityId: communityAdminUser.communityId,
      userId: communityAdminUser.userId,
    });

    if (!communityAdminUserDoc)
      throw new MicrosserviceException(
        'usuário adm da comunidade não encontrado',
        HttpStatus.NOT_FOUND,
      );

    return communityAdminUserDoc;
  }

  async getCommunityAdminUserByEmail(userEmail: string) {
    const user = await this.userModel.findOne({ email: userEmail });

    const communityAdminUserDoc = await this.userAdminRelationModel.findOne({
      userId: user._id,
    });

    if (!communityAdminUserDoc)
      throw new MicrosserviceException(
        'usuário adm da comunidade não encontrado',
        HttpStatus.NOT_FOUND,
      );

    return communityAdminUserDoc;
  }

  async removeAdminUser(communityAdminUser: CommunityUserDto) {
    const communityAdminUserDoc = await this.getCommunityAdminUser(
      communityAdminUser,
    );

    return communityAdminUserDoc.delete();
  }

  async listCommunities() {
    return this.communityModel.find({});
  }

  async listUsers() {
    return this.userModel.find({});
  }

  async getUserCommunity(userEmail: string) {
    const user = await this.userModel.findOne({ email: userEmail });

    const userRelation = await this.userRelationModel.findOne({
      userId: user._id.toString(),
    });

    if (!userRelation)
      throw new MicrosserviceException(
        'Usuário não possui comunidade',
        HttpStatus.NOT_FOUND,
      );

    return this.getById(userRelation.communityId.toString());
  }

  async getUsersWithouACommunity() {
    const users: UserDto[] = await this.userModel.aggregate([
      {
        $match: {
          type: '1',
        },
      },
      {
        $addFields: {
          id: {
            $toString: '$_id',
          },
        },
      },
      {
        $lookup: {
          from: 'userrelations',
          localField: 'id',
          foreignField: 'userId',
          as: 'community',
        },
      },
      {
        $match: {
          community: {
            $size: 0,
          },
        },
      },
      {
        $project: {
          community: 0,
        },
      },
    ]);

    if (!users.length)
      throw new MicrosserviceException(
        'Não há usuários sem comunidades',
        HttpStatus.NOT_FOUND,
      );

    return users;
  }

  async getAreaByCommunityId(commId: string) {
    const communityData: AreaDto[] = await this.communityModel.aggregate([
      {
        $match: {
          _id: Types.ObjectId(commId),
        },
      },
      {
        $addFields: {
          id: {
            $toString: '$_id',
          },
        },
      },
      {
        $lookup: {
          from: 'communityrelations',
          localField: 'id',
          foreignField: 'communityId',
          as: 'communityRelation',
        },
      },
      {
        $unwind: {
          path: '$communityRelation',
        },
      },
      {
        $addFields: {
          locationId: {
            $toObjectId: '$communityRelation.locationId',
          },
        },
      },
      {
        $lookup: {
          from: 'areas',
          localField: 'locationId',
          foreignField: '_id',
          as: 'areaCommunity',
        },
      },
      {
        $unwind: {
          path: '$areaCommunity',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $replaceRoot: {
          newRoot: '$areaCommunity',
        },
      },
    ]);

    if (!communityData.length)
      throw new MicrosserviceException(
        'Dados insuficiente para esta comunidade!',
        HttpStatus.NOT_FOUND,
      );

    return communityData;
  }

  async exportCommunityDataToKml(communityId: string) {
    const communityData = await this.getAreaByCommunityId(communityId);
    const geoJsonData = [];

    communityData.forEach((area) => {
      geoJsonData.push({
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: area.coordinates,
        },
        properties: {
          name: area.title,
        },
      });
    });

    const geoJson = {
      type: 'FeatureCollection',
      features: geoJsonData,
    };
    const kmlCommunityData = tokml(geoJson);

    return kmlCommunityData;
  }
}
