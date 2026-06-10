import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { Branch } from 'src/branches/entities/branch.entity';

@Injectable()
export class CustomersService {
    constructor(
        @InjectRepository(Customer)
        private customerRepository: Repository<Customer>,

        @InjectRepository(Branch)
        private branchRepository: Repository<Branch>
    ) { }
    async getCustomersByBranch(
        branchId: string,
    ) {

        const branch =
            await this.branchRepository.findOne({
                where: {
                    id: branchId,
                },
            });

        if (!branch) {
            throw new NotFoundException(
                'Branch not found',
            );
        }

        const customers =
            await this.customerRepository.find({
                where: {
                    branchId,
                },
            });

        return {
            totalCustomers: customers.length,
            customers,
        };
    }
}
