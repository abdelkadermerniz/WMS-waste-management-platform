import torch
import torch.nn as nn
from torchvision import models

def get_model(num_classes):
    """
    Returns a pre-trained ResNet18 model modified for our specific number of classes.
    """
    # Load pre-trained ResNet18
    # We use the new weights parameter instead of pretrained=True
    model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)

    # Freeze all earlier layers to speed up training as we only want to train the head
    for param in model.parameters():
        param.requires_grad = False

    # Replace the final classification head
    num_ftrs = model.fc.in_features
    # We make the new head trainable and add dropout for regularization
    model.fc = nn.Sequential(
        nn.Dropout(0.3),                 
        nn.Linear(num_ftrs, num_classes)
    )

    return model
