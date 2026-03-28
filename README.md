# 🌍 Waste Management Platform (WMS)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Docker Support](https://img.shields.io/badge/Docker-Supported-2496ED?logo=docker&logoColor=white)](./docker-compose.yml)
[![Next.js 14](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-Backend-green?logo=express)](https://expressjs.com/)
[![PyTorch](https://img.shields.io/badge/PyTorch-AI%20Classifier-EE4C2C?logo=pytorch&logoColor=white)](https://pytorch.org/)

An enterprise-grade, comprehensive Waste Management System offering a robust logistics API, a modern administrative dashboard, and a cutting-edge AI-powered Waste Classifier.

## 🚀 Features

- **Centralized Dashboard:** A professional Next.js backoffice providing a master view of system analytics, classifications, user administration, and system health.
- **AI-Powered Waste Classification:** State-of-the-art computer vision model built with PyTorch, utilizing Transfer Learning, to automatically categorize waste types (plastic, paper, organic, etc.) from images.
- **Clean Architecture API:** A highly scalable Express REST API designed with a multi-layered clean architecture for handling logistics, permissions, and entity management.
- **Containerized Workflows:** Entire infrastructure runs out-of-the-box via Docker Compose.
- **Secure by Default:** Implementations include bcrypt-based passwords, JWT multi-layer auth (Refresh + Access tokens), and helmet configuration.

## 📦 Tech Stack

### Frontend Dashboard (`apps/next-backoffice`)
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **UI & Styling:** Tailwind CSS, Shadcn UI, Radix UI Primitives
- **Data Management:** TanStack Query & TanStack Table
- **Forms & Validation:** React Hook Form + Zod
- **Visualizations:** Recharts

### Backend Service (`apps/express-api`)
- **Framework:** Express.js 
- **Language:** TypeScript
- **Database Architecture:** MySQL 8.0, Sequelize ORM
- **Testing Engine:** Vitest
- **Security:** JWT, Helmet, Morgan Logging, bcryptjs
- **Documentation:** Swagger-UI integration

### AI Classifier (`ia/waste_classifier`)
- **Framework:** PyTorch & Torchvision
- **Language:** Python
- **Paradigm:** Convolutional Neural Networks, Transfer Learning (ResNet/MobileNet)
- **Data Pipeline:** Advanced Data Augmentation and automated validation loops.

---

## 📂 Architecture & Project Structure

The repository uses a monorepo-style structure encompassing all services:

```text
waste-management-platform/
├── apps/
│   ├── express-api/        # Core logistics & authentication REST API
│   └── next-backoffice/    # Next.js admin dashboard frontend
├── ia/
│   └── waste_classifier/   # PyTorch Computer Vision modeling & inference scripts
├── documentations/         # Implementation plans and design specs
├── docker-compose.yml      # Infrastructure topology orchestration
└── .env.example            # Environment variables template
```

---

## 🛠️ Getting Started

### Prerequisites
- [Docker & Docker Compose](https://www.docker.com/) 
- [Node.js](https://nodejs.org/) v20+ (optional, for local development outside Docker)
- [Python 3.10+](https://www.python.org/) (optional, if modifying the AI model locally)

### Option 1: Run with Docker Compose (Recommended)
This requires zero configuration and launches the entire application stack:
1. **Clone the repository:**
   ```bash
   git clone https://github.com/abdelkadermerniz/WMS-waste-management-platform.git
   cd WMS-waste-management-platform
   ```
2. **Setup environment parameters:**
   Rename `.env.example` to `.env` and adjust passwords and JWT secrets as needed.

3. **Start the containers:**
   ```bash
   docker-compose up --build
   ```

**Services spin up mapping:**
- **Next.js Dashboard:** `http://localhost:3000`
- **Express API:** `http://localhost:3001` 
- **MySQL Database:** Port `3306` inside bridge network
- **Adminer (DB UI):** `http://localhost:8080`

### Option 2: Local Development Setup

If you wish to modify individual services natively without the containerized layer:

#### Backend API 
```bash
cd apps/express-api
npm install
npm run dev
# The API will be available at http://localhost:3001
```

#### Backoffice Dashboard 
```bash
cd apps/next-backoffice
npm install
npm run dev
# The Next.js dashboard will be available at http://localhost:3000
```

#### AI Component
```bash
cd ia/waste_classifier
pip install -r requirements.txt
python src/train.py
```

---

## 🧠 Using the AI Waste Classifier

The AI module is designed to classify real-world waste items to automate logistics. 
- Ensure you have placed your data in a structured `data/` directory (e.g. `data/plastic/`, `data/paper/`).
- The neural network is dynamically adaptable and utilizes transformations like `RandomHorizontalFlip` and pre-trained weights to maintain high inference accuracy under different environmental situations.
- Detailed implementation and evolution specs can be found in `documentations/implementation_plan.md`.

## 🛡️ License

This project is licensed under the MIT License - see the LICENSE file for details.
