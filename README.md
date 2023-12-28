# Cloud-Kitchen-Bakery: Sweet Tooth

## This Project was made with Vite in React-Redux and Firebase on backend.
#### It was made for CS50x's Final Project and the idea is based on one of the prototypes I devloped in my Design Thinking Class. More information about the project in Problem Statement.docx

#### Current Issues: Profile and cart actions creating seperate firestore documents for one user. Dashboard Home using hardcoded information due to lack of more information.

## Getting Started
- Create your Firebase Project in http://console.firebase.google.com.
  
- Under Your Apps follow instructions to initialize app in the client folder.
  
- Copy config in dashboard's Web Setup and paste to firebase.config.js or copy it to .env for more security
  
- Follow instruction in [firebase website](https://firebase.google.com/docs/admin/setup#initialize_the_sdk_in_non-google_environments) to get your ServiceAccountKey and move the file inside server/functions.
  
- Install dependencies
  
  `npm install`

  inside project folder install firebase-tools and then `firebase login` with your credentials

  My Project uses tailwindcss so don't forget to install that as well.

Once the above steps are over - 

`npm run serve` inside server/functions to run firebase emulator.

`npm run dev` inside client to run the Vite project.
