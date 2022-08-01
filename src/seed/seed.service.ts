import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './database/factory';

@Injectable()
export class SeedService {
  constructor(private readonly productService: ProductsService) {}

  async run() {
    this.productService.deleteAllProducts();

    const productSeeds = initialData.products;

    const productPromise = [];

    for (const product of productSeeds) {
      productPromise.push(this.productService.create(product));
    }

    await Promise.all(productPromise);

    return { message: 'Products seeds' };
  }
}
