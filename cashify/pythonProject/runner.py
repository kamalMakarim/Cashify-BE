import torch
import cv2
import requests
import numpy as np
from torchvision import transforms
from main import TrashClassifier  # Ensure main.py is in the same directory or adjust the import
import time

# Backend server URL (replace with your server's URL)
BACKEND_URL = "http://your-backend-server.com/api/trash-detected"

# Load the model
model = TrashClassifier()
model.load_state_dict(torch.load('trash_classifier.pth'))
model.eval()

# Define image transformation
transform = transforms.Compose([
    transforms.ToPILImage(),
    transforms.Resize((128, 128)),
    transforms.ToTensor(),
    transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
])


# Define a function to capture and process the camera feed
def capture_and_classify():
    # Start capturing video from the webcam
    cap = cv2.VideoCapture(0)

    while True:
        # Capture frame-by-frame
        ret, frame = cap.read()
        if not ret:
            print("Failed to capture image")
            break

        # Preprocess the frame for the model
        image = transform(frame)
        image = image.unsqueeze(0)  # Add batch dimension

        # Run the frame through the model
        with torch.no_grad():
            output = model(image)
            _, predicted = torch.max(output, 1)
            class_index = predicted.item()

        # Check if the detected object is trash (adjust class index as per your dataset)
        # For example, assume class index 0 represents trash
        if class_index == 0:
            print("Trash detected!")
            send_to_backend(frame)

        # Display the frame with a label (for debugging)
        label = "Trash" if class_index == 0 else "Not Trash"

        cv2.putText(frame, label, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        cv2.imshow("Trash Detection", frame)

        # Press 'q' to quit the loop
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Release the capture and close windows
    cap.release()
    cv2.destroyAllWindows()


# Function to send image to backend when trash is detected
def send_to_backend(image):
    # Convert the image to JPEG format for sending
    _, img_encoded = cv2.imencode('.jpg', image)
    img_bytes = img_encoded.tobytes()

    # Prepare payload
    files = {'file': ('trash.jpg', img_bytes, 'image/jpeg')}
    data = {'timestamp': time.time()}

    try:
        # Send POST request to backend
        response = requests.post(BACKEND_URL, files=files, data=data)
        if response.status_code == 200:
            print("Successfully sent data to backend")
        else:
            print(f"Failed to send data: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"Error sending data to backend: {e}")


if __name__ == "__main__":
    capture_and_classify()
