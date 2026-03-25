import os
import torch
import torch.nn as nn
import torch.optim as optim
from dataset import get_dataloaders
from model import get_model

# Directories
DATA_DIR = "data/TRAIN"
MODEL_SAVE_PATH = "best_model.pth"

# Hyperparameters
BATCH_SIZE = 32
EPOCHS = 10
LEARNING_RATE = 0.001

def main():
    # 1. Device Setup
    if torch.cuda.is_available():
        device = torch.device("cuda")
    elif torch.backends.mps.is_available():
        device = torch.device("mps")
    else:
        device = torch.device("cpu")
    print(f"🚀 Running on: {device}")

    # 2. Data Pipeline
    print("Loading data...")
    train_loader, val_loader, class_names, num_classes = get_dataloaders(
        data_dir=DATA_DIR, 
        batch_size=BATCH_SIZE
    )

    if train_loader is None or num_classes == 0:
        print(f"❌ Error: We need images! Please put your real dataset inside '{DATA_DIR}/'")
        print(f"Example folder structure:")
        print(f"  {DATA_DIR}/plastic/img1.jpg")
        print(f"  {DATA_DIR}/paper/img1.jpg")
        print(f"  {DATA_DIR}/organic/img1.jpg")
        return

    # 3. Model Initialization
    print("Initializing ResNet18 model...")
    model = get_model(num_classes=num_classes)
    model = model.to(device)

    # 4. Optimizer & Loss
    criterion = nn.CrossEntropyLoss()
    # We only train the newly created fully connected layer because the rest is frozen
    optimizer = optim.Adam(model.fc.parameters(), lr=LEARNING_RATE)

    # 5. Training Loop
    print(f"Starting Training for {EPOCHS} epochs...")
    best_val_acc = 0.0

    for epoch in range(EPOCHS):
        # --- Training Phase ---
        model.train()
        running_loss = 0.0
        running_corrects = 0

        for inputs, labels in train_loader:
            inputs, labels = inputs.to(device), labels.to(device)

            optimizer.zero_grad()
            outputs = model(inputs)
            _, preds = torch.max(outputs, 1)
            loss = criterion(outputs, labels)
            
            loss.backward()
            optimizer.step()

            # Track statistics
            running_loss += loss.item() * inputs.size(0)
            running_corrects += torch.sum(preds == labels.data)
        
        epoch_train_loss = running_loss / len(train_loader.dataset)
        epoch_train_acc = running_corrects.float() / len(train_loader.dataset)

        # --- Validation Phase ---
        model.eval()
        val_loss = 0.0
        val_corrects = 0

        with torch.no_grad():
            for inputs, labels in val_loader:
                inputs, labels = inputs.to(device), labels.to(device)

                outputs = model(inputs)
                _, preds = torch.max(outputs, 1)
                loss = criterion(outputs, labels)

                val_loss += loss.item() * inputs.size(0)
                val_corrects += torch.sum(preds == labels.data)

        epoch_val_loss = val_loss / len(val_loader.dataset)
        epoch_val_acc = val_corrects.float() / len(val_loader.dataset)

        print(f"Epoch {epoch+1}/{EPOCHS}")
        print(f"  Train Loss: {epoch_train_loss:.4f} Acc: {epoch_train_acc:.4f}")
        print(f"  Val Loss:   {epoch_val_loss:.4f} Acc: {epoch_val_acc:.4f}")

        # Save check-points
        if epoch_val_acc > best_val_acc:
            print(f"  ⭐ Saving new best model with {epoch_val_acc*100:.2f}% accuracy!")
            best_val_acc = epoch_val_acc
            torch.save(model.state_dict(), MODEL_SAVE_PATH)

    print("Training complete! Best validation accuracy: {:.2f}%".format(best_val_acc * 100))

if __name__ == "__main__":
    main()
