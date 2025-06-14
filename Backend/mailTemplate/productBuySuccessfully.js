exports.productBuySuccessfully = (ProductName, name) => {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <style>
            body {
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding: 0;
            }
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }
    
            .logo {
                max-width: 200px;
                margin-bottom: 20px;
            }
    
            .message {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }
    
            .cta {
                display: inline-block;
                padding: 10px 20px;
                background-color: #ffD60A;
                color: #000000;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
                font-weight: bold;
                margin-top: 20px;
            }
    
            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
            }
    
            .body {
                font-size: 16px;
                margin-bottom: 20px;
            }
    
            .highlight {
                font-weight: bold;
            }
        </style>
    </head>
    
    <body>
        <div class="container">
            <div class="message">Pruduct Bought Confirmation</div>
            <div class="body">
                <p>Dear ${name},</p>
                <p>
                    You have Successfully Buy 
                    <span class="highlight">${
                      ProductName.length > 15
                        ? ProductName.substring(0, 10)
                        : ProductName
                    }</span>.
                </p>
                <p>
                    Please log in to your Order dashboard to access the your order Items
                    <a href="">Go to My Order</a>
                </p>
            </div>
            <div class="support">
                If you have any questions or need assistance, please feel free to reach
                out to <a href="mailto:info@Shopping24.com">info@Shopping24.com</a>
                we are here to help you.
            </div>
        </div>
    </body>
    
    </html>`;
};
