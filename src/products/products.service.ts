import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryDto } from 'src/common/dtos/query.dto';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Image, Product } from './entities';

@Injectable()
export class ProductsService {
  private logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...restProduct } = createProductDto;

      const imagesDB = images.map((url) =>
        this.imageRepository.create({ url }),
      );

      const product = this.productRepository.create({
        ...restProduct,
        images: imagesDB,
      });

      await this.productRepository.save(product);

      return { ...product, images };
    } catch (error) {
      this.handleException(error);
    }
  }

  async findAll(query: QueryDto) {
    const { page = 1, perPage = 1000 } = query;

    const skip = (page - 1) * perPage;

    const products = await this.productRepository.find({
      relations: { images: true },
      skip,
      take: perPage,
    });

    return products.map((product) => ({
      ...product,
      images: product.images.map(({ url }) => url),
    }));
  }

  async findOne(slug: string) {
    const product = await this.productRepository.findOne({ where: { slug } });

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    return {
      ...product,
      images: product.images.map(({ url }) => url),
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { images, ...toUpdate } = updateProductDto;
      const product = await this.productRepository.preload({ id, ...toUpdate });

      if (!product) {
        throw new BadRequestException('Product not found');
      }

      if (images) {
        await queryRunner.manager.delete(Image, { product: { id } });
        product.images = images.map((url) =>
          this.imageRepository.create({ url }),
        );
      }

      await queryRunner.manager.save(product);

      await queryRunner.commitTransaction();
      await queryRunner.release();
      // await this.productRepository.save(product);

      return { ...product, images };
    } catch (error) {
      await queryRunner.rollbackTransaction();
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

  async deleteAllProducts() {
    try {
      // const query = this.productRepository.createQueryBuilder('product');
      // await query.delete().where({}).execute();

      await this.productRepository.delete({});
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error occurred on the server.');
    }
  }
}
