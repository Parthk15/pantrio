🥬 PANTRIO
Your Kitchen. Smarter, Fresher, More Organized.
<p align="center">
  <strong>An Explainable AI Framework for Smart Kitchen Decision Support and Food Management</strong>
</p>
<p align="center">
  <img src="https://img.shields.io/badge/Project-Academic%20PBL-8B9D77?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge\&logo=react\&logoColor=black" />
  <img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge\&logo=fastapi\&logoColor=white" />
  <img src="https://img.shields.io/badge/OCR-PaddleOCR-5B8CFF?style=for-the-badge" />
</p>
<p align="center">
  <em>Less food waste. Smarter decisions. Better kitchens.</em>
</p>
---
✦ The Idea
What if your grocery receipt could do more than just tell you how much you spent?
Pantrio transforms everyday grocery shopping into an intelligent kitchen-management experience.
Instead of manually entering groceries, tracking ingredients or wondering what to cook, Pantrio brings these activities together in one place.
Upload a grocery bill, extract its contents, organise your pantry and discover recipes based on the ingredients you already own.
The goal is simple: make kitchen management easier while encouraging smarter food consumption and reducing unnecessary waste.
---
✦ Why Pantrio?
Most households face familiar problems:
Groceries get forgotten after shopping.
Pantry quantities are difficult to track.
Ingredients sometimes expire before being used.
People struggle to decide what to cook with available ingredients.
Missing ingredients lead to unnecessary purchases.
Pantrio addresses these challenges through an integrated grocery-processing and kitchen decision-support workflow.
---
✦ What Makes It Special?
<table>
<tr>
<td width="50%" valign="top">
📸 Smart Bill Scanning
Upload grocery receipt images and extract text using PaddleOCR.
</td>
<td width="50%" valign="top">
🧾 Intelligent Bill Parsing
Convert extracted receipt text into structured grocery information such as item names, quantities, units and prices.
</td>
</tr>
<tr>
<td width="50%" valign="top">
🥗 Pantry Management
Organise available ingredients and monitor inventory and low-stock information.
</td>
<td width="50%" valign="top">
🍳 Recipe Recommendations
Discover recipes by matching their ingredient requirements with available pantry items.
</td>
</tr>
<tr>
<td width="50%" valign="top">
📉 Food-Waste Awareness
Support better ingredient utilisation and more informed kitchen decisions.
</td>
<td width="50%" valign="top">
🔍 Explainable Recommendations
Make recipe suggestions easier to understand by showing how available ingredients relate to recipe requirements.
</td>
</tr>
</table>
---
✦ How It Works
<p align="center">
  <strong>From a grocery receipt to a smarter kitchen.</strong>
</p>
```text
       ┌──────────────────────┐
       │    GROCERY RECEIPT   │
       │      Upload Image    │
       └──────────┬───────────┘
                  │
                  ▼
       ┌──────────────────────┐
       │       PaddleOCR      │
       │    Text Extraction   │
       └──────────┬───────────┘
                  │
                  ▼
       ┌──────────────────────┐
       │     BILL PARSER      │
       │  Structured Data     │
       └──────────┬───────────┘
                  │
                  ▼
       ┌──────────────────────┐
       │  PANTRY INVENTORY    │
       │ Ingredient Tracking  │
       └──────────┬───────────┘
                  │
                  ▼
       ┌──────────────────────┐
       │  RECIPE MATCHING     │
       │ Ingredient Analysis │
       └──────────┬───────────┘
                  │
                  ▼
       ┌──────────────────────┐
       │  SMARTER DECISIONS   │
       │ Recipe Suggestions   │
       │ \& Kitchen Management │
       └──────────────────────┘
```
The workflow, simplified
Stage	What happens
01 — Upload	User uploads a grocery receipt
02 — Extract	OCR recognises text from the receipt
03 — Parse	Python identifies grocery information
04 — Organise	Inventory logic manages available ingredients
05 — Recommend	Recipe matching checks ingredient availability
06 — Manage	Users can make more informed cooking and purchasing decisions
---
✦ Technology Stack
Built using a combination of modern frontend technologies and Python-based backend processing.
Technology	Purpose
React.js	Interactive frontend
JavaScript	Frontend application logic
Vite	Development server and build tooling
CSS	Interface styling
Python	Backend processing
FastAPI	REST API development
PaddleOCR	Receipt text recognition
PaddlePaddle	OCR inference framework
Pillow	Image processing
Axios	Frontend-backend communication
Uvicorn	ASGI server
Git & GitHub	Version control and source-code hosting
---
✦ System Architecture
```text
┌──────────────────────────────────────────────┐
│                 FRONTEND                     │
│                                              │
│  React.js + Vite                             │
│                                              │
│  Home │ Scan │ Inventory │ Recipes           │
│                                              │
└──────────────────────┬───────────────────────┘
                       │
                  Axios / HTTP
                       │
                       ▼
┌──────────────────────────────────────────────┐
│                  BACKEND                     │
│                                              │
│                FastAPI                       │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │             OCR ENGINE                 │  │
│  │              PaddleOCR                 │  │
│  └────────────────────┬───────────────────┘  │
│                       ▼                      │
│  ┌────────────────────────────────────────┐  │
│  │              BILL PARSER               │  │
│  │        Regex-based text parsing        │  │
│  └────────────────────┬───────────────────┘  │
│                       ▼                      │
│  ┌────────────────────────────────────────┐  │
│  │          APPLICATION LOGIC             │  │
│  │ Inventory │ Recipes │ Consumption      │  │
│  └────────────────────────────────────────┘  │
│                                              │
└──────────────────────────────────────────────┘
```
---
✦ Project Structure
```text
Pantrio/
│
├── data/                      # Sample receipt images
│
├── frontend/                  # React application
│   ├── public/
│   └── src/
│       ├── components/         # Reusable UI components
│       ├── context/            # Shared application state
│       ├── data/               # Recipe and threshold data
│       ├── hooks/              # Reusable React hooks
│       ├── pages/              # Application pages
│       ├── services/           # API communication
│       └── utils/              # Helper and matching logic
│
├── src/                       # Python backend
│   ├── api.py                 # FastAPI application
│   ├── ocr\_reader.py          # OCR processing
│   ├── bill\_parser.py         # Receipt text parsing
│   ├── inventory.py           # Inventory logic
│   ├── history.py             # Cooking history
│   ├── pipeline.py            # Processing workflow
│   ├── recipe\_engine.py       # Recipe consumption logic
│   ├── recipe\_suggester.py    # Recipe suggestions
│   └── purchase\_suggester.py  # Purchase suggestions
│
├── tests/                     # Backend tests
├── requirements.txt           # Python dependencies
└── .gitignore
```
---
✦ Getting Started
Want to run Pantrio locally? Follow these steps.
Prerequisites
Make sure you have installed:
Python 3.13
Node.js and npm
Git
A code editor such as Visual Studio Code
1. Clone the repository
```bash
git clone https://github.com/Parthk15/pantrio.git
cd pantrio
```
2. Backend Setup
Create a virtual environment:
```powershell
python -m venv .venv
```
Activate it in Windows PowerShell:
```powershell
.\\.venv\\Scripts\\Activate.ps1
```
Install the dependencies:
```powershell
pip install -r requirements.txt
```
Start the backend server:
```powershell
python -m uvicorn src.api:app --reload --port 8000
```
Backend runs at:
`http://localhost:8000`
API documentation:
`http://localhost:8000/docs`
3. Frontend Setup
Open a second terminal:
```powershell
cd frontend
npm install
```
Create a `.env` file inside the `frontend` directory:
```env
VITE\_API\_URL=http://127.0.0.1:8000
```
Start the frontend:
```powershell
npm run dev
```
Frontend runs at:
`http://localhost:5173`
4. You're Ready!
Open the frontend URL in your browser and start exploring Pantrio.
> \*\*Note:\*\* PaddleOCR may download its pretrained models during the first run. Initial startup can take longer depending on your system and network connection.
---
✦ API Reference
Pantrio uses a FastAPI backend to process receipt images and provide application services.
Method	Endpoint	Description
GET	`/`	Backend health check
POST	`/api/scan-bill`	Upload and process a grocery receipt
Example API response
```json
{
  "success": true,
  "items": \[
    {
      "name": "Tomato",
      "quantity": 1,
      "unit": "kg",
      "price": 40.0
    }
  ]
}
```
The example illustrates the intended structured response format.
---
✦ Testing
The project includes tests for important application logic.
```text
tests/
└── test\_bill\_parser.py
```
Frontend recipe matching tests are also included:
```text
frontend/src/utils/recipeMatcher.test.js
```
Run backend tests:
```powershell
python -m pytest
```
Run frontend tests using the project's configured test tooling.
---
✦ Future Scope
Pantrio is designed to grow beyond basic grocery tracking.
Potential improvements include:
Improved OCR accuracy for different receipt layouts.
More robust item recognition and quantity extraction.
Expiry-date tracking and notifications.
Personalised recipe recommendations.
Nutritional information and dietary preferences.
Better inventory persistence and synchronisation.
Enhanced explainability for recommendation decisions.
Mobile application support.
---
✦ Our Vision
We believe smarter kitchens begin with better everyday decisions.
Pantrio aims to connect grocery shopping, ingredient management and meal planning into one simple experience.
Because food should be enjoyed, not forgotten.
<p align="center">
  <strong>🥬 PANTRIO</strong>
  <br/>
  <em>Make every ingredient count.</em>
</p>
---
✦ Project Information
Project Title: Explainable AI Framework for Smart Kitchen Decision Support and Food Management
Project Name: Pantrio
Category: Academic Project / Smart Kitchen Management
Repository: github.com/Parthk15/pantrio
---
<p align="center">
  <sub>Designed and developed as an academic project.</sub>
  <br/>
  <sub>© 2026 Pantrio — All rights reserved by the project team.</sub>
</p>
