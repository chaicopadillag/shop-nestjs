import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const GetRawHeader = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const { headers } = request;

    if (!headers) throw new InternalServerErrorException('Headers not found');

    return data ? headers[data] : headers;
  },
);
