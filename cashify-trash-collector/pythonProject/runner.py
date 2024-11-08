import torch
import cv2
import requests
import numpy as np
from torchvision import transforms, models
import time

# Backend server URL (replace with your server's URL)
BACKEND_URL = "http://your-backend-server.com/api/trash-detected"

# Define the class labels based on your folder structure
class_labels = ['cardboard', 'glass', 'metal', 'paper', 'plastic', 'trash']

# Load the ResNet model and configure it
model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
num_features = model.fc.in_features
model.fc = torch.nn.Linear(num_features, len(class_labels))  # Adjust output layer for the number of classes

# Load the saved model weights
model.load_state_dict(torch.load('best_trash_classifier.pth'))
model.eval()

# Define image transformation
transform = transforms.Compose([
    transforms.ToPILImage(),
    transforms.Resize((128, 128)),
    transforms.ToTensor(),
    transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
])

# Function to capture and classify
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

        # Get the predicted label
        label = class_labels[class_index]

        # Check if the detected object is trash
        if label == 'trash':
            print("Trash detected!")
            send_to_backend(frame)

        # Display the frame with the predicted label
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
    _, img_encoded = cv2.imencode('.jpg', image)
    img_bytes = img_encoded.tobytes()

    files = {'file': ('trash.jpg', img_bytes, 'image/jpeg')}
    data = {'timestamp': time.time()}

    try:
        response = requests.post(BACKEND_URL, files=files, data=data)
        if response.status_code == 200:
            print("Successfully sent data to backend")
        else:
            print(f"Failed to send data: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"Error sending data to backend: {e}")

if __name__ == "__main__":
    capture_and_classify()
