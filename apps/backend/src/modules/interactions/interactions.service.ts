import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthenticatedUser } from '../../common/types';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { UpdateInteractionDto } from './dto/update-interaction.dto';
import { InteractionsRepository } from './interactions.repository';

@Injectable()
export class InteractionsService {
  constructor(private readonly interactionsRepository: InteractionsRepository) {}

  async findByContact(contactId: string) {
    return this.interactionsRepository.findByContact(contactId);
  }

  async findOne(id: string) {
    const interaction = await this.interactionsRepository.findById(id);
    if (!interaction) throw new NotFoundException('error.interactionNotFound');
    return interaction;
  }

  async create(dto: CreateInteractionDto, currentUser: AuthenticatedUser) {
    return this.interactionsRepository.create({
      type: dto.type,
      description: dto.description,
      date: dto.date,
      contact_id: dto.contactId,
      created_by: currentUser.id,
    });
  }

  async update(id: string, dto: UpdateInteractionDto) {
    return this.interactionsRepository.update(id, {
      type: dto.type,
      description: dto.description,
      date: dto.date,
      updated_at: new Date().toISOString(),
    });
  }

  async remove(id: string) {
    await this.interactionsRepository.delete(id);
    return { deleted: true };
  }
}
