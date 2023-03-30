import axios from 'axios';
import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import multer from 'multer';
import { MulterNextApiRequest } from '@/types/global';

const upload = multer({ storage: multer.memoryStorage() });
const handler = nextConnect<MulterNextApiRequest, NextApiResponse>();

handler.use(upload.single('file'));

function bufferToBlob(buffer: Buffer, mimeType: string): Blob {
  return new Blob([new Uint8Array(buffer)], { type: mimeType });
}

handler.post(async (req, res) => {
  console.log(req.body); // Add this log statement to inspect the req.file object
  try {
    const fastAPIUrl = 'http://localhost:8000/extract_frames';
    const formData = new FormData();
    formData.append(
      'file',
      bufferToBlob(req.file.buffer, req.file.mimetype),
      req.file.originalname
    );
    formData.append('fps_to_save', req.body.fps_to_save);

    const response = await axios.post(fastAPIUrl, formData, {
      responseType: 'arraybuffer',
    });

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${
        response.headers['content-disposition'].split('=')[1]
      }`
    );
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while processing the request.' });
  }
});

export default handler;
