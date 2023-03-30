import os
import cv2


def video_to_frames(video_path, output_folder, fps_to_save=1):
    # Create the output folder if it doesn't exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Open the video file
    video_capture = cv2.VideoCapture(video_path)

    # Check if the video file was opened successfully
    if not video_capture.isOpened():
        raise ValueError(f"Error: Unable to open the video file: {video_path}")

    # Get the video's FPS
    video_fps = int(video_capture.get(cv2.CAP_PROP_FPS))
    frame_interval = video_fps // fps_to_save

    frame_count = 0
    saved_frame_count = 0
    frames = []

    while True:
        # Read a frame from the video
        ret, frame = video_capture.read()

        # Break the loop if we reached the end of the video
        if not ret:
            break

        # Save the frame as an image if it's the right interval
        if frame_count % frame_interval == 0:
            output_image_path = os.path.join(output_folder, f"frame{saved_frame_count:04d}.png")
            cv2.imwrite(output_image_path, frame)
            frames.append(output_image_path)
            saved_frame_count += 1

        frame_count += 1

    # Release the video capture and close all windows
    video_capture.release()
    cv2.destroyAllWindows()

    return frames
