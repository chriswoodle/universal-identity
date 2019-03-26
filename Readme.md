![logo](https://raw.githubusercontent.com/chriswoodle/universal-identity/master/graphics/logo.png)

# Universal Identity

Universal Identity or u-ID for short, is a digital identity platform that is interoperable and accepted by different requesting parties. Data, API's and other information related to a unique identity are accessible through a secure and permissioned interface.

# Overview 

The U-ID platform is composed of 4 primary entities. 

![components](https://raw.githubusercontent.com/chriswoodle/universal-identity/master/graphics/components.png)

* User - The end user of the platform. 
* Client - Some organization that is requesting information or actions to be taken from a user.
* Data Provider - A 3rd party data source or API that the user already has an existing relationship with. This provider may hold confidential information and take actions on behalf of the user, such as preforming a credit transaction. 
* Universal Identity Platform - The middleware system that provides a process and secure APIs to pass information through the U-ID platform to Data providers.

# Workflow

## Model A

This process allows a client to request data from a user. To streamline the process and keep convienience as similar to existing experiences, it was designed to require a minimum of one interaction between the User and Client. It is required that:

* The user have a hardware computer device with an internet connection and custom application such as a smart phone
* The client have a hardware computer device with an internet connection and custom application with some hardware device that can interface with the user's device, such as a pay kiosk with NFC emulator.

![model a](https://raw.githubusercontent.com/chriswoodle/universal-identity/master/graphics/generic-ssd.png)

1. The client first creates a session, which is a single request to an unknown user.
2. The client then provides the session id to a user. This can be through some physical or digital process, such as NFC, local network, QR code, or other process.
3. The user may then optionally verify the contents of the clients request with U-ID. This allows the user to ensure that the client is not recieving any unintended access or information.
4. The user then approves or rejects the session.
5. If the session is approved, U-ID will then preform the necessary requests with dataproviders, and send back the results to the client.

## Model B

This process allow the user to pre-provision some hardware device with a temporary key that can grant access to a selected set U-ID dataprovider access (such as if a user is over the age of 21, but not their exact age).

![model B](https://raw.githubusercontent.com/chriswoodle/universal-identity/master/graphics/temp-key-ssd.png)

1. A user create a temporary key. The user will select what access this key can grant. The key could be a physical key, such as an rfid wrist band, or a software key, such as a mobile phone app where the user might select check boxes and NFC scan. See below figure.
2. Then the key exchange will operate like existing credit card purchases. The user gives a client the temporary key, and the client requests data from U-ID.

![pick access](https://raw.githubusercontent.com/chriswoodle/universal-identity/master/graphics/create-key.png)


## Provisioning Devices
Future device key provisioning workflow. This would generate an auth token that a kiosk deicve could use to authenticate to U-ID. 
![provision](https://raw.githubusercontent.com/chriswoodle/universal-identity/master/graphics/device-provision.png)


# Other screenshots

### Server log
![server-log](https://raw.githubusercontent.com/chriswoodle/universal-identity/master/graphics/server-log.png)

### NFC kiosk log
![nfc-log](https://raw.githubusercontent.com/chriswoodle/universal-identity/master/graphics/nfc-log.png)

# Team
Chris Woodle 
Nick Silva
Muntaser Syed