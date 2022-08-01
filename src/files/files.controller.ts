import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UnprocessableEntityException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileNameHelper, fileFilter } from './helpers';

@Controller('file')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('products/:fileName')
  async getFile(@Res() res: Response, @Param('fileName') fileName: string) {
    const pathFile = await this.filesService.getPathFile(fileName);

    res.status(200).sendFile(pathFile);
  }

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter,
      storage: diskStorage({
        destination: './uploads/products',
        filename: fileNameHelper,
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new UnprocessableEntityException('No file provided');

    const url = `${process.env.APP_URL}/file/products/${file.filename}`;
    return {
      url,
    };
  }
}
