# react-native-authentication

The main goal of this project is to show you how to register and authenticate a user and access protected resources from a React-Native app to a NodeJS server.

If you want to know more about this project, you can read this article which describe how it works:

The Essential Boilerplate to Authenticate Users on your React-Native app.<br />
https://medium.com/@alexmngn/the-essential-boilerplate-to-authenticate-users-on-your-react-native-app-f7a8e0e04a42

This project has been tested with Node v6.0.0 and NPM 3.8.6.

## Client

### Installation

If you don't have React-Native installed on your computer, run the following:
```
npm install -g react-native-cli
```

Go in the `client/MobileApp` directory, and run the following:

```
npm install
```

### Run

iOS:
```
react-native run-ios
```
Android:

You will need to follow a few steps to run the client:

- Open the file `client/MobileApp/src/services/api/config.js`
- Modify `localhost` with the IP address of your machine (usually something like 192.168.0.10)
```
export default {
	clientId: '8puWuJWZYls1Ylawxm6CMiYREhsGGSyw',
	url: 'http://192.168.0.10:1337',
};
```
- Create a file called `local.properties` in the `/MobileApp/android` folder and add the following line (replace the target with the path to your SDK): `sdk.dir = /Users/Alexis/Library/Android/sdk`
- Open an Emulator (from Android Studio) or plug an Android device on your computer.
- Then you can run the following in terminal:
```
react-native run-android
```

### Use

You can login with the following user:
- Email: **user1@facebook.com**
- Password: **12345678**

There is also a Client-ID that has already been generated, currently hard-coded in the client api config:
- **8puWuJWZYls1Ylawxm6CMiYREhsGGSyw**


## Server

### Installation


If you don't have SailsJS installed on your computer, run the following:
```
npm install -g sails
```

Go in the `server` directory, then run the following:

```
npm install
```

### Run

Run the following in the terminal:

```
sails lift
```

This will create a server listening on port 3000, you can access it from http://localhost:3000/. The server needs to run at all time when you use the client.

### Entry-points:

An open entry-point is provided to generate this ID. This should not be done in production:

- `POST /clients`

The non-protected entry-points allow authentication and registration:

- `POST /users`: Create a new user
- `POST /users/auth`: Authenticate and retrieve the access and refresh tokens in exchange of email/password
- `POST /users/auth/refresh`: Authenticate and retrieve the access token in exchange of the refresh token.

The protected entry-point allows everything else:
- `GET /users`: Retrieve the list of users
- `POST /users/auth/revoke`: Log out, revoke access by destroying the user tokens
