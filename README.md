# MIMICLLM Back-End
This repository contains the back-end service for the MIMIC LLM project. It processes clinical data and provides AI-driven insights, communicating with the front-end for an efficient user experience.
> **Reminder:**  
> Please run Back-End server before start the front-end part
## How to Use This Project
### Step 1: Clone the Repository
Clone the repository to your local machine:

```bash
git clone https://github.com/jerryshu98/MIMICLLM-back-end.git
```

## Step 2: Navigate to the Project Directory
Once the repository is cloned, navigate to the project directory:

```bash
cd MIMICLLM-back-end
```

## Step 3: Install Dependencies
Install the necessary dependencies for the back-end using npm:
```bash
npm install
```
## Step 4: Start the Back-End Server
Start the back-end server with the following command:
```bash
node server.js
```
The server will start and listen for incoming requests from the front-end. Ensure the front-end is configured to interact with the back-end properly.

## Node.js Installation

If you don't have Node.js installed, follow these steps to install it:

1. Visit the official [Node.js website](https://nodejs.org/).
2. Download the **LTS version** (recommended for most users) for your operating system.
3. Follow the installation instructions on the website.
4. After installation, verify by running the following commands in your terminal:

```bash
node -v
npm -v
