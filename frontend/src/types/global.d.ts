import { NextApiRequest } from 'next';

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export interface MulterNextApiRequest extends NextApiRequest {
  file: MulterFile;
}

declare module multer {}
