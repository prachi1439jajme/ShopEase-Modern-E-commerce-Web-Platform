exports.contactOwner = (
  phone,
  firstName,
  lastName,
  message,
) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Inquiry Template</title>
    <style>
    body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
}

.email-container {
    max-width: 600px;
    margin: 20px auto;
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.email-header h2 {
    margin-top: 0;
    color: #333;
}

.email-body p {
    margin: 10px 0;
    color: #555;
}

.email-body ol {
    margin-left: 20px;
}

@media (max-width: 600px) {
    .email-container {
        padding: 15px;
    }

    .email-header h2 {
        font-size: 20px;
    }

    .email-body p {
        font-size: 14px;
    }
}
</style>
</head>
<body>
    <div class="email-container">
        <div class="email-body">
            <p>Dear Shopping24 Team,</p>
            <p>I hope this email finds you well.</p>
            <p>I am ${firstName} ${lastName}. I am interested to find the more items and products about your Website. Could you please provide details on:</p>
              <p>${message}</p>
            <p>Thank you for your assistance.</p>
            <p>Best regards,</p>
            <p>${firstName} ${lastName}<br>  ${phone}</p>
        </div>
    </div>
</body>
</html>
`;
};
