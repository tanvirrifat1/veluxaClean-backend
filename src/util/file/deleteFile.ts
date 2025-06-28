import fs from 'fs/promises';
import path from 'path';
import colors from 'colors';
import { errorLogger, logger } from '../../shared/logger';

const deleteFile = async (file: string) => {
  const filePath = path.join(process.cwd(), 'uploads', file);

  logger.info(colors.yellow(`🗑️ Deleting file: ${filePath}`));
  try {
    await fs.unlink(filePath);
    logger.info(colors.green('✔ File deleted successfully'));
  } catch (error) {
    errorLogger.error(
      colors.red(`❌ Failed to delete file: ${filePath}`),
      error
    );
  }
};

export default deleteFile;
