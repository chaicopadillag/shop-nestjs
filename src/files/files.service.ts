import { Injectable, NotFoundException } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  getPathFile(fileName: string) {
    const pathFile = join(__dirname, '../../uploads/products', fileName);

    if (!existsSync(pathFile)) throw new NotFoundException('File not found');

    return pathFile;
  }
}
