import { HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

export class MicrosserviceException extends RpcException {
  constructor(exception: string, status: HttpStatus) {
    super({
      status: status,
      message: exception,
    });
  }
}
