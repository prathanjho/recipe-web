# recipe-web
Part of final project of Intro to CEDT Chula

INORDER TO RUN ON LOCAL COMPUTER
Requirements

-Node.js (v18+ recommended)
-npm
-MongoDB Atlas account or local MongoDB
-API token for Gemini (or any other recipe AI API, required changing API-request method in local.js file-backend folder)
-Setup Instructions
-Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

Install dependencies

```bash
npm install
```

Configure backend

Go to the frontend folder and open config.js.

Change the backend_url variable to point to your backend server.
Example:

```bash
const backend_url = "http://localhost:3000";
```

Setup environment variables

Copy .env.template to .env in the root folder:

```bash
cp .env.template .env
```

Open .env and fill in your credentials:

```bash
MONGO_URI=<your MongoDB URI>
GEMINI_API_KEY=<your Gemini API key>
```

Start the server

```bash
cd backend
node local.js
```

The backend should now run at http://localhost:3000 (or the port you set in .env).

Open the frontend

Open frontend/index.html in your browser.

Or, if you serve it via Express static folder, open:

http://localhost:3000
