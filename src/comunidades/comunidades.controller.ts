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

  @MessagePattern('getAdminUsers')
  async getAdminUsers(@Payload() communityId: string) {
    return this.comunidadesService.getAdminUsers(communityId);
  }

  @MessagePattern('addAdminUser')
  async addAdminUser(@Payload() communityAdminUser: CommunityUserDto) {
    return this.comunidadesService.addAdminUser(communityAdminUser);
  }

  @MessagePattern('getCommunityAdminUser')
  async getCommunityAdminUser(@Payload() communityAdminUser: CommunityUserDto) {
    return this.comunidadesService.getCommunityAdminUser(communityAdminUser);
  }

  @MessagePattern('removeAdminUser')
  async removeAdminUser(@Payload() communityAdminUser: CommunityUserDto) {
    return this.comunidadesService.removeAdminUser(communityAdminUser);
  }

  @MessagePattern('getUserCommunity')
  async getUserCommunity(@Payload() userEmail: string) {
    return this.comunidadesService.getUserCommunity(userEmail);
  }

  @MessagePattern('listCommunities')
  async listCommunities() {
    return this.comunidadesService.listCommunities();
  }

  @MessagePattern('listUsers')
  async listUsers() {
    return this.comunidadesService.listUsers();
  }

  @MessagePattern('getCommunityAdminUserByEmail')
  async getCommunityAdminUserByEmail(@Payload() userEmail: string) {
    return this.comunidadesService.getCommunityAdminUserByEmail(userEmail);
  }

  @MessagePattern('getUsersWithouACommunity')
  async getUsersWithouACommunity() {
    return this.comunidadesService.getUsersWithouACommunity();
  }
}
