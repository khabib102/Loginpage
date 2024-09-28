const express = require('express');
const fetch = require('node-fetch');
const app = express();

// Route for handling Google OAuth callback
app.get('/auth/google/callback', async (req, res) => {
  const accessToken = req.query.access_token || req.query.code;

  if (!accessToken) {
    return res.status(400).send('Access token missing');
  }

  // Exchange access token for user information
  try {
    const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`);
    const userInfo = await response.json();

    // Process user info here (e.g., register the user)
    console.log('User Info:', userInfo);

    // Redirect back to your main app after successful login
    res.redirect('/dashboard');  // Your app's dashboard or home page
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(5500, () => {
  console.log('Server started on http://localhost:5500');
});



const express = require('express');
const fetch = require('node-fetch');
const querystring = require('querystring');

const clientId = 'Ov23li3semtSc6fklkox';  // Replace with your GitHub Client ID
const clientSecret = 'd86a46d4c24ff724142d84b594ed0d25559ef2ab';  // Replace with your GitHub Client Secret

// Route to handle GitHub OAuth callback
app.get('/auth/github/callback', async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send('Authorization code missing');
  }

  // Exchange the authorization code for an access token
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
    }),
  });
  
  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;

  if (!accessToken) {
    return res.status(400).send('Failed to retrieve access token');
  }

  // Use the access token to retrieve the user's GitHub profile
  const userResponse = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `token ${accessToken}`,
    },
  });
  const userInfo = await userResponse.json();

  // Process user info here (e.g., register the user in your database)
  console.log('GitHub User Info:', userInfo);

  // Redirect the user to your app's dashboard or another page after login
  res.redirect('/dashboard');  // Adjust according to your app's needs
});

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
