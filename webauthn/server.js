const express = require("express");
const bodyParser = require("body-parser");
const { Fido2Lib } = require("fido2-lib");

const app = express();
const port = 3000;

const fido2 = new Fido2Lib({
    timeout: 60000,
    rpId: "localhost",
    rpName: "My App",
    challengeSize: 32,
    attestation: "none",
    cryptoParams: [-7, -257],  // ES256 and RS256
});

let users = {}; // In-memory user storage (not for production)

// Body-parser middleware
app.use(bodyParser.json());

// Generate a registration challenge (public key creation)
app.post("/register", async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).send("Username required");
    }

    const challenge = await fido2.attestationOptions();
    users[username] = { challenge, credentials: [] };

    res.json(challenge);
});

// Verify the registration and store public key
app.post("/register/complete", async (req, res) => {
    const { username, attestationResponse } = req.body;

    if (!users[username]) {
        return res.status(400).send("User not found");
    }

    const attestationExpectations = {
        challenge: users[username].challenge.challenge,
        origin: "http://localhost:3000",
        factor: "either",
    };

    const credential = await fido2.attestationResult(attestationResponse, attestationExpectations);

    users[username].credentials.push({
        id: credential.authnrData.get("credId"),
        publicKey: credential.authnrData.get("credentialPublicKeyPem"),
    });

    res.send("Registration successful");
});

// Generate an authentication challenge
app.post("/authenticate", async (req, res) => {
    const { username } = req.body;

    if (!users[username]) {
        return res.status(400).send("User not found");
    }

    const challenge = await fido2.assertionOptions();

    users[username].challenge = challenge.challenge;

    res.json(challenge);
});

// Verify the authentication response
app.post("/authenticate/complete", async (req, res) => {
    const { username, assertionResponse } = req.body;

    const user = users[username];
    if (!user) {
        return res.status(400).send("User not found");
    }

    const assertionExpectations = {
        challenge: user.challenge,
        origin: "http://localhost:3000",
        factor: "either",
        publicKey: user.credentials[0].publicKey,
    };

    try {
        const result = await fido2.assertionResult(assertionResponse, assertionExpectations);
        res.send("Authentication successful");
    } catch (error) {
        res.status(400).send("Authentication failed");
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
