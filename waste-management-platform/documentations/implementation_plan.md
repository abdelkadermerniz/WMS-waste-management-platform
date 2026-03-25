# Improve Waste Classifier for Real Data

To achieve the best possible classification results on real-world images, we need to transition away from the simple 3-layer neural network and fake random dataset, into a professional computer vision pipeline utilizing **Transfer Learning** and **Data Augmentation**.

## User Review Required
> [!IMPORTANT]
> To load the real data, please let me know:
> 1. Where the real images will be stored (e.g. `ia/waste_classifier/data/`)?
> 2. What is the folder structure? (Usually, it should be categorized by subfolders like `data/plastic/`, `data/paper/`, `data/organic/`).
> 3. Does your dataset already have a train/validation split, or should our code split it automatically?

## Proposed Changes

### Data Pipeline Update
#### [MODIFY] [dataset.py](file:///Users/hichemmerniz/Jobs/Project/waste-management-platform/ia/waste_classifier/src/dataset.py)
- Refactor the code to use `torchvision.datasets.ImageFolder` to dynamically load real images from your hard drive.
- Implement robust Data Augmentation using `torchvision.transforms` (e.g. Resizing to 224x224, RandomHorizontalFlip, RandomRotation, and standard ImageNet Normalization) to make the model robust against lighting and angle changes.

---

### Architecture Update
#### [MODIFY] [model.py](file:///Users/hichemmerniz/Jobs/Project/waste-management-platform/ia/waste_classifier/src/model.py)
- Import a powerful pre-trained Convolutional Neural Network (CNN) like **ResNet18** or **MobileNetV3** from `torchvision.models`.
- We will use Transfer Learning: taking the pre-trained weights that already understand geometric features and edges, and replacing the final fully-connected classification head to output the exact number of waste categories in our dataset.

---

### Training Loop & Metrics Update
#### [MODIFY] [train.py](file:///Users/hichemmerniz/Jobs/Project/waste-management-platform/ia/waste_classifier/src/train.py)
- Update data loaders to fetch the new `ImageFolder` datasets.
- Introduce a **Validation Phase** in each epoch to calculate both Loss and **Accuracy**. Currently, the loop only tracks training loss, which doesn't reflect real-world performance.
- Implement **Model Checkpointing**: Save the model (`best_model.pth`) automatically whenever the validation accuracy hits a new high.

## Verification Plan
1. Ensure the user provides the location to the real data folder.
2. I will implement the code and execute [train.py](file:///Users/hichemmerniz/Jobs/Project/waste-management-platform/ia/waste_classifier/src/train.py) for 5 epochs.
3. We will monitor the validation accuracy printouts to guarantee the AI correctly learns to map images to classes using the Mac's GPU.
