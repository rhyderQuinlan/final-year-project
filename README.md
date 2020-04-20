# Pay As You Drive
The purpose of the Pay As You Drive project is to develop a mobile application for the Android & iOS platforms that will, first and foremost, track driving habits of a user whilst travelling on a journey. Driving habits are recorded and used for motor insurance purposes, whereby a user pays a monthly insurance price based solely on how much and how well/poorly they drive. The application allows the user to view their past journey, control their profile details and vehicles through the app, and finally create and monitor insurance claims within the application.

Pay As You Drive is designed with a Peer 2 Peer business approach, whereby users are nodes in a network. Each month the nodes are billed for their driving, and this money is gathered into one central money pool. In the event of an accident, fire or theft to their motor vehicle an insurance claim can be made, and if approved, a transfer takes place from the money pool to the users wallet.

## Technologies
- React Native
- Expo
- Firebase
- Cloud Storage
- Cloud API
- Kaleido
- Solidity

## How to install
### Expo Snack
This project was developed in an expo environment, so the easiest way to view and use the application is in an emulator on the [expo site](https://expo.io/@rhyderquinlan/pay-as-you-drive).

Or Download Expo Client on [android](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en) or [iOS](https://apps.apple.com/us/app/expo-client/id982107779).

Then scan the QR code given on the link below with your android or iOS phone.

[https://expo.io/@rhyderquinlan/pay-as-you-drive](https://expo.io/@rhyderquinlan/pay-as-you-drive)

### Install Locally
If you want to run the project on your local machine:
1. install [node.js](https://nodejs.org/en/download/)
1. install [react native](https://www.npmjs.com/package/react-native)
1. install [expo-cli](https://docs.expo.io/versions/latest/get-started/installation/)
4. Download Expo Client on [android](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en) or [iOS](https://apps.apple.com/us/app/expo-client/id982107779)
4. Open repo locally
5. install node modules
``` 
cd development/pay-as-you-drive
npm install
```
7. Run Expo on localhost
```
expo start
```
8. Scan the QR code given console from your Expo Client App.

## Permissions
Pay As You Drive requires:
- Location permission
- Camera Permission
- Storage Permisions
