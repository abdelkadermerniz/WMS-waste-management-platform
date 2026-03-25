import torch



print(f"PyTorch Version: {torch.__version__}")
print(f"CUDA available in PyTorch: {torch.cuda.is_available()}")
print(f"MPS (Apple Silicon GPU) available in PyTorch: {torch.backends.mps.is_available()}")

if torch.cuda.is_available():
    print(f"CUDA version PyTorch expects: {torch.version.cuda}")
    print(f"GPU Name: {torch.cuda.get_device_name(0)}")
elif torch.backends.mps.is_available():
    print("GPU Name: Apple Silicon GPU (MPS)")
