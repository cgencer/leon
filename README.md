# Leon Charting

We're gonna chart some live-data from adafruit API with react-native on IOS & Android.

## Client

### Installation

First, install /& update
npm and node.js
Everything else is installed by npm

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

## Server

The server is located on heroku. I mostly bypassed all login functions (remarked them), which can be activated on a real-login step when needed. 


### Entry-points of the login-server:

An open entry-point is provided to generate this ID. This should not be done in production:

- `POST /clients`

The non-protected entry-points allow authentication and registration:

- `POST /users`: Create a new user
- `POST /users/auth`: Authenticate and retrieve the access and refresh tokens in exchange of email/password
- `POST /users/auth/refresh`: Authenticate and retrieve the access token in exchange of the refresh token.

The protected entry-point allows everything else:
- `GET /users`: Retrieve the list of users
- `POST /users/auth/revoke`: Log out, revoke access by destroying the user tokens
