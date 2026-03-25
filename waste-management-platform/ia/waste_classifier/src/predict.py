import os
import sys
import torch
import torchvision.transforms as transforms
from PIL import Image
from model import get_model

# Constants
# We use the correct path relative to this script
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "best_model.pth")

# Datasets like this sort classes alphabetically: 'O' = 0, 'R' = 1
CLASS_NAMES = ["O", "R"] # Organic, Recyclable
NUM_CLASSES = len(CLASS_NAMES)

# Same transforms as validation
val_transforms = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def predict_image(image_path):
    if not os.path.exists(image_path):
        print(f"Error: Image '{image_path}' not found.")
        return

    # Load device
    if torch.cuda.is_available():
        device = torch.device("cuda")
    elif torch.backends.mps.is_available():
        device = torch.device("mps")
    else:
        device = torch.device("cpu")
    print(f"Using device: {device}")

    # Load Model
    model = get_model(num_classes=NUM_CLASSES)
    
    if not os.path.exists(MODEL_PATH):
        print(f"Error: Model weights not found at '{MODEL_PATH}'")
        return
        
    model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
    model = model.to(device)
    model.eval()

    # Process image
    try:
        image = Image.open(image_path).convert('RGB')
    except Exception as e:
        print(f"Error opening image: {e}")
        return

    input_tensor = val_transforms(image).unsqueeze(0).to(device) # Add batch dimension

    # Predict
    with torch.no_grad():
        outputs = model(input_tensor)
        probabilities = torch.nn.functional.softmax(outputs, dim=1)
        confidence, predicted_idx = torch.max(probabilities, 1)
        
        predicted_class = CLASS_NAMES[predicted_idx.item()]
        conf_percentage = confidence.item() * 100

    print(f"--- Prediction Results ---")
    print(f"Image: {image_path}")
    print(f"Predicted Class: {predicted_class} ({'Organic' if predicted_class == 'O' else 'Recyclable'})")
    print(f"Confidence: {conf_percentage:.2f}%")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python predict.py <path_to_image>")
        sys.exit(1)
    
    target_image = sys.argv[1]
    predict_image(target_image)
