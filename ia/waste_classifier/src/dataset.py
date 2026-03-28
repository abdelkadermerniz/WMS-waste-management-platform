import os
import copy
import torch
from torchvision import datasets, transforms
from torch.utils.data import DataLoader, random_split, Subset

def get_dataloaders(data_dir="data", batch_size=32, train_split=0.8):
    # Ensure data directory exists
    if not os.path.exists(data_dir):
        print(f"Directory {data_dir} not found. Please create it and add your image folders (e.g., data/plastic/, data/paper/)")
        return None, None, [], 0
    
    # 1. Transforms with Data Augmentation for training
    train_transforms = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(15),
        transforms.ColorJitter(brightness=0.2, contrast=0.2),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    # 2. Transforms for validation (only resize and normalize)
    val_transforms = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    # Load dataset
    full_dataset = datasets.ImageFolder(root=data_dir, transform=train_transforms)
    class_names = full_dataset.classes
    num_classes = len(class_names)
    
    if len(full_dataset) == 0:
         return None, None, class_names, num_classes

    print(f"Found {len(full_dataset)} images belonging to {num_classes} classes: {class_names}")

    # Split dataset
    train_size = int(train_split * len(full_dataset))
    val_size = len(full_dataset) - train_size
    train_dataset, val_dataset_temp = random_split(full_dataset, [train_size, val_size])

    # Trick to apply different transform to validation split
    # We deepcopy the base dataset and change its transform
    val_dataset_base = copy.deepcopy(full_dataset)
    val_dataset_base.transform = val_transforms
    val_dataset = Subset(val_dataset_base, val_dataset_temp.indices)

    # Data loaders
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, num_workers=0)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False, num_workers=0)

    return train_loader, val_loader, class_names, num_classes
