import cv2
from deepface import DeepFace
import requests
import base64
import json
import numpy as np

def process_video_stream(video_stream, image_url):
    # Decode video stream
    video_array = base64.b64decode(video_stream)
    video_np = np.frombuffer(video_array, dtype=np.uint8)
    video = cv2.imdecode(video_np, flags=cv2.IMREAD_COLOR)

    # Load the image from URL
    response = requests.get(image_url)
    img_array = bytearray(response.content)

    # Decode the image using OpenCV
    image = cv2.imdecode(np.asarray(img_array), cv2.IMREAD_COLOR)

    # Detect faces using deepface
    face_locations_video = DeepFace.detectFace(video, detector_backend='opencv')
    face_locations_image = DeepFace.detectFace(image, detector_backend='opencv')

    if not face_locations_video or not face_locations_image:
        print("No faces found in video or image")
        return False  # No faces found, indicating no match

    # Verify if the faces in the video and image belong to the same person
    result = DeepFace.verify(face_locations_video[0], face_locations_image[0])

    return result['verified']

# # Example usage
# # Assuming you receive video_stream and image_url from the Node.js server

# result = process_video_stream(video_stream_from_server, image_url_from_server)

# # Handle the result using the socket connection as needed
# # Example: socket.send(result)

def main():

    video_stream_file = sys.argv[1]
    user_image_url = sys.argv[2]

    video_stream = ''
    # Load the video stream and user image
    with open(video_stream_file, 'r') as file:
        video_stream = file.read()
    
    result = process_video_stream(video_stream, user_image_url)

    return result

    # ... rest of the code

