## ScamOrion Web App Frontend Client Setup

This code depicts the frontend client setup of the ScamOrien Web Application. It is deployed on Vercel.

## Setup Prerequisites

Prior to setting up the repository for use, please ensure that the following prerequisites have been installed into the environment.

- Node.js v24.1.0 - (If not installed) Install this version from Node.js official website.

## Installation Steps

1. **Clone the Repository**  
   After copying or cloning the code repository, navigate to the project directory:

```
   git clone <this-repository-url>
   cd <project-directory>
```

2. **Configure Environment Variables**  
   Create a `.env` file with the following variable (refer to the `COMP0073_Environment_Variables_PMSQ8.docx` for environment variable template):

- `NEXT_PUBLIC_API_URL` (Ensure URL matches your backend FastAPI server).

3. **Install Node Dependencies**  
   Install dependencies via:

```

npm install
```

4. **Start the Application**  
   Build and start the application using:

```
npm run build
npm run start
```

5. **Verify the Setup**  
   Open [http://localhost:3000](http://localhost:3000) in your browser. Ensure the backend is running first.
