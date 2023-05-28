import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

@Injectable()
export class FileExtender implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    Object.entries(req.body).forEach((item) => {
      if (req.file) {
        req.file[item[0]] = item[1];
      }
    });

    return next.handle();
  }
}

@Injectable()
export class FilesExtender implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    Object.entries(req.body).forEach((item) => {
      req.files = req.files.map((_item) => {
        return {
          ..._item,
          [item[0]]: item[1],
        };
      });
    });

    return next.handle();
  }
}
