import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../uploads');

/**
 * Safely delete an uploaded file from server filesystem when updating or removing
 * @param {string} folder - 'brands' | 'models' | 'users'
 * @param {string} filenameOrUrl - filename or URL of the image to delete
 */
export const deleteUploadFile = (folder, filenameOrUrl) => {
  if (!filenameOrUrl) return;
  if (filenameOrUrl.includes('placeholder')) return;

  // Extract raw filename
  const filename = path.basename(filenameOrUrl);
  if (!filename || filename.includes('placeholder')) return;

  const filePath = path.join(uploadsDir, folder, filename);

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted old upload file: ${filePath}`);
    }
  } catch (err) {
    console.error(`Failed to delete old file (${filePath}):`, err.message);
  }
};
