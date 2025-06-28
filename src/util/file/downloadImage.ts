import axios from 'axios';
import { logger } from '../../shared/logger';
import colors from 'colors';
import { createDir } from './createFile';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const imageDir = path.join(process.cwd(), 'uploads', 'image');

const downloadImage = async (url: string) => {
  logger.info(colors.green(`🔍 Downloading image from: ${url}`));
  try {
    createDir(imageDir);

    const fileName = `${uuidv4()}.png`;

    const destination = path.join(imageDir, fileName);

    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    });

    const writer = fs.createWriteStream(destination);

    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(true));
      writer.on('error', reject);
    });

    logger.info(
      colors.green(`✅ Image downloaded successfully: ${destination}`)
    );

    return `/image/${fileName}`;
  } catch (error) {
    logger.error(colors.red('🤢 Failed to download image'));
  }
};

export default downloadImage;
