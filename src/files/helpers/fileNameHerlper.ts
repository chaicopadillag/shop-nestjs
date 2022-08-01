/* eslint-disable @typescript-eslint/ban-types */
export const fileNameHelper = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!file) return callback('No file provided', false);

  const fileExtension = file.originalname.split('.').pop();
  const fileName = `${Date.now()}.${fileExtension}`;

  return callback(null, fileName);
};
