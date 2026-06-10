import { BadRequestException, Injectable } from '@nestjs/common';
import path from 'path';
import sharp from 'sharp';
import * as fs from 'fs';

@Injectable()
export class FileUploadService {

  async handleFileUpload(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('no file uploaded')
    }

    const maxSize = 4 * 1024
    // if (file.size > maxSize) {
    //   throw new BadRequestException('photo size is too much')
    // }

    // const allowedType = ['image/jpg', 'image/png', 'application/pdf', 'text/plain', 'video/mp4']
    // if (!allowedType.includes(file.mimetype)) {
    //   throw new BadRequestException('Invalid file type')
    // }
    let finalFilename = file.filename;
    let finalPath = file.path;

    // Compress only if image is larger than 5 MB
    if (
      file.size > maxSize &&
      ['image/jpeg', 'image/png'].includes(file.mimetype)
    ) {
      const compressedFilename = `compressed-${file.filename}`;
      const compressedPath = path.join('uploads', compressedFilename);

      await sharp(file.path)
        .resize({ width: 1200 }) // optional
        .jpeg({ quality: 70 })   // compress quality
        .toFile(compressedPath);

      // Delete original file
      fs.unlinkSync(file.path);

      finalFilename = compressedFilename;
      finalPath = compressedPath;
    }
    return {
      message: 'File uploaded successfully',
      filePath: finalPath,
      imageUrl: `http://localhost:3000/uploads/${finalFilename}`,
    };
  }
}