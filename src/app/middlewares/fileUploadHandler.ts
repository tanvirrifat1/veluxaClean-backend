import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import ApiError from '../../errors/ApiError';

const fileUploadHandler = (req: Request, res: Response, next: NextFunction) => {
  //create upload folder
  const baseUploadDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(baseUploadDir)) {
    fs.mkdirSync(baseUploadDir);
  }

  //folder create for different file
  const createDir = (dirPath: string) => {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
  };

  //create filename
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let uploadDir;
      switch (file.fieldname) {
        case 'image':
          uploadDir = path.join(baseUploadDir, 'images');
          break;
        case 'media':
          uploadDir = path.join(baseUploadDir, 'medias');
          break;
        case 'doc':
          uploadDir = path.join(baseUploadDir, 'docs');
          break;
        default:
          throw new ApiError(StatusCodes.BAD_REQUEST, 'File is not supported');
      }
      createDir(uploadDir);
      cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
      const fileExt =
        file.fieldname === 'doc' ||
        file.fieldname === 'docs' ||
        file.fieldname === 'docx'
          ? '.pdf'
          : '.png';

      if (file.fieldname === 'media') {
        const mediaExt = file.mimetype.split('/')[1];
        cb(null, `${file.originalname.replace(/\s/g, '-')}.${mediaExt}`);
        return;
      }

      const uniqueId =
        Date.now().toString(36) + Math.random().toString(36).substr(2);
      const fileName = file.originalname.replace(
        path.extname(file.originalname),
        ''
      );

      cb(null, `${fileName}-${uniqueId}${fileExt}`);
    },
  });

  //file filter
  const filterFilter = (req: Request, file: any, cb: FileFilterCallback) => {
    if (file.fieldname === 'image') {
      if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/heif' || // Add HEIF support
        file.mimetype === 'image/heic' || // HEIC support (HEIF is often associated with .heic files)
        file.mimetype === 'image/tiff' || // Add TIFF support
        file.mimetype === 'image/webp' || // Add WebP support
        file.mimetype === 'image/avif' // Add AVIF support
      ) {
        cb(null, true);
      } else {
        cb(
          new ApiError(
            StatusCodes.BAD_REQUEST,
            'Only .jpeg, .png, .jpg, .heif, .heic, .tiff, .webp, .avif files supported'
          )
        );
      }
    } else if (file.fieldname === 'media') {
      if (file.mimetype === 'video/mp4' || file.mimetype === 'audio/mpeg') {
        cb(null, true);
      } else {
        cb(
          new ApiError(
            StatusCodes.BAD_REQUEST,
            'Only .mp4, .mp3, file supported'
          )
        );
      }
    } else if (file.fieldname === 'doc') {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new ApiError(StatusCodes.BAD_REQUEST, 'Only pdf supported'));
      }
    } else {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'This file is not supported');
    }
  };

  // Return multer middleware
  const upload = multer({
    storage: storage,
    fileFilter: filterFilter,
  }).fields([
    { name: 'image', maxCount: 3 },
    { name: 'media', maxCount: 3 },
    { name: 'doc', maxCount: 3 },
  ]);

  return upload(req, res, next);
};

export default fileUploadHandler;
