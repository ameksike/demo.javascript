## WebAuthn and Passkey Example in Node.js

Below is a demo that shows how to implement WebAuthn (which can also be adapted for passkeys) in a Node.js application using express and fido2-lib.

```shell 
npm install express fido2-lib body-parser
```

### Demo Flow
- User Registration:
	- User visits /register, submits a username, and receives a registration challenge.
	- The client generates a key pair (via WebAuthn APIs) and sends the public key to /register/complete.
	- Server verifies the challenge and stores the public key.

- User Authentication:
	- User visits /authenticate, submits the username, and receives a challenge.
	- The client signs the challenge with the private key (stored locally or synced via passkey).
	- The signed challenge is sent to /authenticate/complete, where the server verifies it using the stored public key.

## Notes
- WebAuthn provides strong, passwordless authentication using public-key cryptography and hardware authenticators.
- Passkeys improve the WebAuthn experience by allowing credentials to sync across devices, making it easier for users to manage.
- Both are highly secure, but Passkeys offer a more convenient user experience, especially in multi-device environments.

### WebAuthn Flow
- User Registration (Create Credential):
	- The web app initiates a request to register a new authenticator (biometric device or security key).
	- The client device (browser or OS) prompts the user to choose an authenticator (security key, Face ID, etc.).
	- The authenticator generates a public-private key pair.
	- The public key is sent back to the server, which stores it associated with the user's account.
- User Authentication (Verify Credential):
	- The user logs into the web app.
	- The server sends a challenge (random value) to the client.
	- The authenticator signs the challenge with the private key and sends it back to the server.
	- The server verifies the signature using the stored public key to authenticate the user.

### Passkey Flow
- User Registration (Create Passkey):
	- Similar to WebAuthn, but passkeys are tied to the device’s biometric or password login (e.g., Touch ID).
	- The public-private key pair is generated locally, and the public key is sent to the server.
	- Credentials can be synced across devices using cloud services (e.g., iCloud, Google), meaning the user can authenticate on another device without re-registering.
- User Authentication (Use Passkey):
	- When logging in on any device, the user selects a passkey from their list.
	- The server sends a challenge.
	- The device signs the challenge using the private key stored on-device or synced via the cloud.
	- The server verifies the signature using the public key.


