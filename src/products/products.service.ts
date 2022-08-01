import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryDto } from 'src/common/dtos/query.dto';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);

      await this.productRepository.save(product);

      return product;
    } catch (error) {
      this.handleException(error);
    }
  }

  async findAll(query: QueryDto) {
    const { page, perPage } = query;

    const skip = (page - 1) * perPage;

    return await this.productRepository.find({
      skip,
      take: perPage,
    });
  }

  async findOne(slug: string) {
    const product = await this.productRepository.findBy({ slug });

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.productRepository.preload({
        id,
        ...updateProductDto,
      });

      if (!product) {
        throw new BadRequestException('Product not found');
      }

      await this.productRepository.save(product);

      return product;
    } catch (error) {
      this.handleException(error);
    }
  }

  async remove(id: string) {
    const product = await this.productRepository.findOneBy({ id });

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    await this.productRepository.remove(product);
  }

  private handleException(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Error occurred on the server.');
  }
}
