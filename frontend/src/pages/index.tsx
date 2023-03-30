import Layout from '@/components/layout/Layout';
import axios from 'axios';
import Head from 'next/head'
import { useRef, useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fpsInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (file === null) {
      return
    }

    if (!fileInputRef.current || !fpsInputRef.current || !fileInputRef.current.files) {
      console.error("Refs not available");
      return;
    }

    const maxFileSize = 25600
    if (file.size / 1024 > maxFileSize) {
      console.log("File too big. Upload an mp4 file that is 25mb or less")
      return
    }


    const formData = new FormData();
    formData.append("file", file);
    formData.append("fps_to_save", fpsInputRef.current.value);

    try {
      setLoading(true)
      console.log("Submitting form");
      const response = await axios.post("http://localhost:8000/extract_frames", formData, {
        responseType: 'blob' // Make sure this line is still present
      });
      console.log("Form submitted successfully");

      // Find the content-disposition header in a case-insensitive way
      const contentDispositionHeader = Object.keys(response.headers).find(header =>
        header.toLowerCase() === 'content-disposition'
      );

      // Extract the filename from the content-disposition header
      const fileName = contentDispositionHeader
        ? response.headers[contentDispositionHeader].split("=")[1]
        : 'frames.zip'; // Use a default filename if the header is not found

      // Automatically download the returned zip file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      setLoading(false)
      setFile(null)
    } catch (error) {
      console.error("Error submitting form", error);
      setLoading(false)
    }
  };

  const removeFile = () => {
    setFile(null)
  }

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className='py-8 max-w-4xl mx-auto'>
          <div>
            <h1 className='text-2xl'>MP4 To Image Converter</h1>
          </div>
          <form className='py-16 mx-auto ' onSubmit={handleSubmit}>
            <div>
              <label htmlFor="fps" className="block text-sm font-medium leading-6 text-gray-900">
                How many images do you want to save for each second of the video?
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  name="fps"
                  id="fps"
                  className="block w-full px-4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  defaultValue={1}
                  ref={fpsInputRef}
                />
              </div>
            </div>
            <div className="col-span-full">
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-500"
                    >
                      {!file && <span>Upload a file</span>}
                      <input onChange={(e) => handleFileChange(e)} id="file-upload" name="file-upload" type="file" className="sr-only" ref={fileInputRef} />
                    </label>
                    {!file && <p className="pl-1">or drag and drop</p>}
                  </div>
                  {!file && <p className="text-xs leading-5 text-gray-600">(max size 25MB)</p>}
                  {file &&
                    <>
                      <p>{file.name}</p>
                      <button className='mt-1 text-red-500 hover:text-red-600' onClick={removeFile}>Remove file</button>
                    </>
                  }
                </div>
              </div>
            </div>
            <div className='py-4'>
              <button
                type="submit"
                className="rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {!loading ? "Convert" : "Converting..."}
              </button>
            </div>

          </form>

          <div className="bg-white px-6 py-8 lg:px-8">
            <div className="mx-auto max-w-4xl text-base leading-7 text-gray-700">
              <p className="mt-6 text-lg leading-8">
                With MP4 to PNG, you can upload your MP4 video files and convert them to high-quality images in PNG format. The maximum file size allowed for
                conversion is 25MB, and the download will begin immediately upon conversion completion.
              </p>
              <div className="mt-6 text-lg leading-8">
                <p>
                  You can choose the number of images you want for each second of your video. For example, if you choose 2 images per second and your video is 10 seconds long
                  with a frame rate of 24fps, then you would get 20 images.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>

    </>
  )
}
