import { Controller, Post, UseInterceptors, UploadedFile, Delete, Param, Patch, Get } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.fileUploadService.handleFileUpload(file);
  }
  @Delete(':filename')
  deleteFile(@Param('filename') filename: string) {
    return this.fileUploadService.deleteFile(filename);
  }

  @Patch(':filename')
  @UseInterceptors(FileInterceptor('file'))
  updateFile(@Param('filename') filename: string, @UploadedFile() file: Express.Multer.File) {
    return this.fileUploadService.UpdateFile(filename, file);
  }

  @Get()
  getAllFiles() {
    return this.fileUploadService.getAllFiles();
  }
}
