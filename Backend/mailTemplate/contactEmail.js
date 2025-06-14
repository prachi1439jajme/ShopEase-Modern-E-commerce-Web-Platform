exports.contactEmail = (email, phone, firstName, lastName, message) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f6f6f6;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            font-family: Arial, sans-serif;
        }
        
        .content {
            padding: 20px;
            color: #333333;
        }
        .team{
          margin-top: -14px;
        }
       

        @media only screen and (max-width: 600px) {
            .email-container {
                padding: 10px;
            }
            .header, .footer {
                padding: 15px;
            }
            .content {
                padding: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="content">
            <p>Hello ${firstName} ${lastName},</p>
            <p>Thank you for contacting us. We have received your message and will respond to you as soon as possible.</p>
            <p>Here are the details you are provided<b>:-</b></p>
            <div style= "padding: 10px 20px; text-decoration: none; border-radius: 5px;"
            <p><b>Full Name-: </b>${firstName} ${lastName}</p>
            <p><b>contact-: </b>${phone}</p>
            <p><b>Message-: </b>${message}</p>
               <p><b>email-: </b>${email}</p>
            </div>
            <p>If you have any questions, feel free to reply to this email. We're here to help!</p>
            <div>
            <p>Best regards,</p>
            <p class="team">Shopping24 Team<p>
            </div>
        </div>
    </div>
</body>
</html>
`;
};
