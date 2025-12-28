# Market Pricing Analytics 📊🛒

Market Pricing Analytics is a system designed to store, track, and analyze historical prices of market products across different establishments.

## 🚀 Features
- Product price history tracking
- Multiple establishments support
- RESTful API
- PostgreSQL database
- Simple frontend integration

## 🧠 Tech Stack
- Node.js
- Express.js (ES Modules)
- PostgreSQL
- HTML / JavaScript
- CORS
- dotenv

## 📂 Project Structure
backend/
├── src/
│ ├── config/
│ ├── controllers/
│ ├── routes/
│ ├── middlewares/
│ └── server.js
├── .env
└── package.json

frontend/
└── js/


## ⚙️ Environment Variables (.env)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mercado_precos
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_SCHEMA=public

bash
Copiar código

## ▶️ Running the Project
```bash
cd backend
npm install
node src/server.js
API will be available at:

bash
Copiar código
http://localhost:3000/api
🔌 API Endpoints
Health Check
bash
Copiar código
GET /api
Establishments
bash
Copiar código
GET  /api/estabelecimentos
POST /api/estabelecimentos
Products
bash
Copiar código
GET  /api/produtos
POST /api/produtos
Prices
bash
Copiar código
GET  /api/precos
POST /api/precos
📈 Future Improvements
Authentication

Dashboard with charts

Price alerts

CSV import/export

👤 Author
Joesley Silva

📜 License
MIT
