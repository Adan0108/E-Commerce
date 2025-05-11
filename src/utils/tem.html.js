'use  strict';

const htmlEmailToken = () =>{
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Verify Your Email</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
    }
    .email-container {
      max-width: 600px;
      margin: auto;
      background: #ffffff;
      padding: 20px;
      border-radius: 6px;
      box-shadow: 0 0 10px rgba(0,0,0,0.05);
    }
    .button {
      display: inline-block;
      padding: 12px 20px;
      margin-top: 20px;
      background-color: #007BFF;
      color: white;
      text-decoration: none;
      border-radius: 4px;
    }
    .footer {
      font-size: 12px;
      color: #888888;
      text-align: center;
      margin-top: 20px;
    }
    @media (max-width: 600px) {
      .email-container {
        padding: 10px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <h2>Confirm Your Email Address</h2>
    <p>Please click the button below to verify your email address and continue:</p>
    <a href="{{link_verify}}" class="button">Verify Email</a>
    <p>If you didn’t request this, you can safely ignore this email.</p>
    <div class="footer">
      &copy; 2025 Your Company Name. All rights reserved.
    </div>
  </div>
</body>
</html>`
}

module.exports = {
  htmlEmailToken
};