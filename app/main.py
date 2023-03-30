from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import cv2
import shutil
from .services.frames import video_to_frames

app = FastAPI()


# Add CORS middleware to allow cross-origin requests
origins = [
    "http://localhost:3000",  # Replace with your Next.js app's URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.post("/extract_frames")
async def extract_frames(file: UploadFile = File(...), fps_to_save: int = 1):
    # Save the uploaded video file to disk
    file_name = file.filename
    file_path = os.path.join("uploads", file_name)
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    # Extract the frames and return their file paths
    output_folder = os.path.join("output_frames", file_name)
    frames = video_to_frames(file_path, output_folder, fps_to_save)

    # Create a zip file containing the extracted frames
    zip_filename = f"{file_name}_frames.zip"
    zip_file_path = os.path.join("output_zips", zip_filename)
    shutil.make_archive(os.path.splitext(zip_file_path)[0], 'zip', output_folder)

    # Return the zip file as a response
    headers = {
        "Content-Disposition": f"attachment; filename={zip_filename}"
    }
    return FileResponse(
        zip_file_path,
        media_type="application/octet-stream",
        headers=headers,
    )