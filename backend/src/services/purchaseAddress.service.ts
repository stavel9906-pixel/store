import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseAddress } from '../entities/purchaseAddress.entity';
import { City } from '../entities/city.entity';
import { orderDetailsDTO } from 'src/entities/DTO/orderDetailsDTO';

@Injectable()
export class PurchaseAddressService {
  constructor(
    @InjectRepository(PurchaseAddress)
    private readonly addressRepo: Repository<PurchaseAddress>,
    @InjectRepository(City)
    private readonly cityRepo: Repository<City>,
  ) {}

  async insertOrderAddress(dto: orderDetailsDTO) {
    const city = await this.cityRepo.findOne({ where: { name: dto.city } });
    if (!city) throw new Error(`City ${dto.city} not found`);

    // מנסים לעדכן קודם
    const updateResult = await this.addressRepo
      .createQueryBuilder()
      .update(PurchaseAddress)
      .set({
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phoneNumber,
        street: dto.street,
        houseNumber: dto.houseNumber.toString(),
        city: city,
      })
      .where('purchase_id = :orderId', { orderId: dto.orderId })
      .execute();

    // אם לא היה עדכון, יוצרים חדש
    if (updateResult.affected === 0) {
      const newAddress = this.addressRepo.create({
        purchase: { id: dto.orderId },
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phoneNumber,
        street: dto.street,
        houseNumber: dto.houseNumber.toString(),
        city: city,
      });
      return this.addressRepo.save(newAddress);
    }
  }
}
