import torch
import cv2
import requests
import numpy as np
from torchvision import transforms, models
import time
import qrcode

# Backend server URL (replace with your server's URL)
BACKEND_URL = "https://cashify-be.vercel.app/trash/create"

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

        # Check if the confidence is high enough to send data to backend
        confidence, predicted = torch.max(torch.nn.functional.softmax(output, dim=1), 1)
        if confidence.item() > 0.99:
            print(f"High confidence detected: {confidence.item() * 100:.2f}% - {label}")
            send_to_backend(frame, label)

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
def send_to_backend(image, label):
    _, img_encoded = cv2.imencode('.jpg', image)
    img_bytes = img_encoded.tobytes()

    files = {'file': ('trash.jpg', img_bytes, 'image/jpeg')}
    data = {'trash_type': label, 'collector_id': "6741b22dadd8499ea5246ef7"}

    try:
        response = requests.post(BACKEND_URL, data=data, headers={'Content-Type': 'application/x-www-form-urlencoded'})
        if response.status_code == 200:
            resdata = response.json().get('data', {}).get('_id', 'No ID found')
            qr_code = np.zeros((300, 300, 3), dtype=np.uint8)
            qr_code = cv2.putText(qr_code, resdata, (10, 150), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
            
            # Generate QR code
            qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
            )
            qr.add_data(resdata)
            qr.make(fit=True)
            qr_img = qr.make_image(fill='black', back_color='white')
            qr_img = np.array(qr_img.convert('RGB'))
            
            cv2.imshow("QR Code", qr_img)
            cv2.waitKey(0)
            cv2.destroyWindow("QR Code")
            print(f"Data sent successfully: {resdata}")
        else:
            print(f"Failed to send data: {response}")
    except requests.exceptions.RequestException as e:
        print(f"Error sending data to backend: {e}")

if __name__ == "__main__":
    capture_and_classify()
