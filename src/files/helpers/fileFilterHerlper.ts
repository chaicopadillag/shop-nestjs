/* eslint-disable @typescript-eslint/ban-types */
export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!file) return callback('No file provided', false);

  const fileTypes = /jpeg|jpg|png|gif/;
  const mimeType = fileTypes.test(file.mimetype);

  if (!mimeType) {
    return callback(null, false);
  }
  return callback(null, true);
};
