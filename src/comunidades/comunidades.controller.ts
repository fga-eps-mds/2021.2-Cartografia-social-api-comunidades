import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ComunidadesService } from './comunidades.service';
import { CreateCommunityDto } from './dto/createCommunity.dto';
import { CommunityUserDto } from './dto/communityUser.dto';
import { UpdateCommunityDto } from './dto/updateCommunity.dto';

@Controller()
export class ComunidadesController {
  constructor(private readonly comunidadesService: ComunidadesService) {}

  @MessagePattern('createCommunity')
  async create(@Payload() createCommunity: CreateCommunityDto) {
    const { id } = await this.comunidadesService.create(createCommunity);

    return id;
  }

  @MessagePattern('updateCommunity')
  async update(@Payload() updateCommunity: UpdateCommunityDto) {
    const { id } = await this.comunidadesService.update(updateCommunity);

    return id;
  }

  @MessagePattern('getCommunity')
  async get(@Payload() id: string) {
    const community = await this.comunidadesService.getById(id);

    return community.toJSON();
  }

  @MessagePattern('deleteCommunity')
  async delete(@Payload() id: string) {
    await this.comunidadesService.destroy(id);

    return true;
  }

  @MessagePattern('getUsers')
  async getUsers(@Payload() communityId: string) {
    return this.comunidadesService.getUsers(communityId);
  }

  @MessagePattern('getCommunityUser')
  async getCommunityUser(@Payload() communityUser: CommunityUserDto) {
    return this.comunidadesService.getCommunityUser(communityUser);
  }

  @MessagePattern('addUser')
  async addUser(@Payload() communityUser: CommunityUserDto) {
    return this.comunidadesService.addUser(communityUser);
  }

  @MessagePattern('removeUser')
  async removeUser(@Payload() communityUser: CommunityUserDto) {
    return this.comunidadesService.removeUser(communityUser);
  }
}
