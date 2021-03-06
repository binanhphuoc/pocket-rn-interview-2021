# Pocket Nurse Interview 2021

This guide assumes that you already have installed Firebase Emulators for Functions and Firestore.

![alt text](https://github.com/binanhphuoc/pocket-rn-interview-2021/blob/main/static/home-page.png?raw=true)

## Building and running app locally

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
Go to `localhost:3000` in your browser. It should looks like the following:

![alt text](https://github.com/binanhphuoc/pocket-rn-interview-2021/blob/main/static/login-page.png?raw=true)


## Features and How to test them
Before you start, please know that this app version handles errors under the scene and does not show them in the UIs yet. You can use the web inspector to check for error logs. E.g. "USER_NOT_LOGGED_IN", "APPOINTMENT_NOT_FOUND", etc.

### 1. Sign Up an account
- From the Login page, click on `"Don't have an account? Sign Up"`
- Type an email and a password. You can use a fake email. You don't have to put First name and Last name, as these fields will be ignored by the current version of the app. Recovering password is not possible right now, so please remember it well.
- Once you click on "`SIGN UP`", you will be logged in automatically.

### 2. Log Out an account:
- On the header bar, click "`SIGN OUT [email]`" to sign out.

### 3. Login with an existing account
- Type in your registered email and password. If you forgot your password, please create another account. Sorry!

### 4. Set up an appointment and invite other accounts
- Firstly, please create another account so you can invite that account when scheduling an appointment.
- Login with one account to set up an appointment.
- Once you're logged in, double-click any time frame to schedule a new appointment.
- In the appointment editor, make sure you have a title and at least one invitation.
- When adding invitations, type emails one-by-one separated by either `[Enter]` or `[Comma]`. Make sure that you type a trailing `[Enter]` or `[Comma]` for the last email, or else the last email will not appear in a bubble. Only bubbled emails are sent to the server.
- Click `Save` when you have done.

```
Notes:
- The current app version does not allow editing details of an existing appointment, 
even if you are the organizer.
- Again, make sure that you type a trailing [Enter] or [Comma] for the last email, or else the last email will not appear in a bubble. Only bubbled emails are sent to the server.
```
![alt text](https://github.com/binanhphuoc/pocket-rn-interview-2021/blob/main/static/set-up-appointment.png?raw=true)


### 5. Maybe, Accept, Decline an invitation
- Log in into the other invited account.
- Once logged in, you should be able to see the appointments that you created or were invited by other accounts.
- Single-click an appointment that you got invited. A tooltip will appear.
- Click Accept, Maybe, or Decline. You will see the color of appointment changed based on your decision.

```
Accept: Green
Maybe: Blue
Decline: Red
```

![alt text](https://github.com/binanhphuoc/pocket-rn-interview-2021/blob/main/static/color-appointments.png?raw=true)

## Plan for Upcoming Features

There will always be plan to improve the UX. If I have a lot of time, I would consider a redesign of the whole app, considering the following features:
- Display errors to user using snackbars.
- Allow users to show or hide Declined appointments.
- Allow users to drag appointments around.
- Allow users to edit/delete an appointment and invite more accounts.
- Allow users to create recurring appointments.
- Allow users to see notifications of unseen appointments, and be able to accept or decline them right in the notification panel.
- Allow users to see and edit their profiles.
- Allow users to customize theme.

