import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

import torch
from model import get_model

def test_model_output_shape():
    """Test if the model outputs the correct shape for a generic dummy input."""
    # Given
    num_classes = 2
    model = get_model(num_classes=num_classes)
    dummy_input = torch.randn(1, 3, 224, 224) # Batch size 1, 3 channels, 224x224 image

    # When
    model.eval()
    with torch.no_grad():
        output = model(dummy_input)

    # Then
    assert output.shape == (1, num_classes), f"Expected shape (1, {num_classes}), but got {output.shape}"
    print("test_model_output_shape passed!")

if __name__ == "__main__":
    test_model_output_shape()
