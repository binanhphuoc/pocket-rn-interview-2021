# Pocket Nurse Interview 2021

This guide assumes that you already have installed Firebase Emulators for Functions and Firestore.

## How to build and run app locally

### 1. Clone repo and install dependencies
- Clone this repo: 
```
git clone https://github.com/binanhphuoc/pocket-rn-interview-2021.git
```
- Install dependencies:
```
cd functions && npm install
cd ../hosting && npm install
```

### 2. Build functions and run emulators
Run the following commands in the project root directory:
```
cd functions
npm run build
firebase emulators:start
```

### 3. Run React app
Open another terminal and run the following commands in the project root directory:
```
cd hosting
npm run start
```

### 4. Open app in browser
Go to `localhost:3000` in your browser.
