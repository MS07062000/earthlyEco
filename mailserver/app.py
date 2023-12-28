# Using flask to make an api 
# import necessary libraries and functions 
from flask import Flask, request 
# from dotenv import load_dotenv
import os
# load_dotenv('../.env')

# creating a Flask app 
app = Flask(__name__) 

@app.route('/sendMail', methods = ['POST']) 
def mailSender(): 
    request_data = request.get_json()
    from send_mail import SendMail;
    # Create SendMail object
    new_mail = SendMail(
        # List (or string if single recipient) of the email addresses of the recipients
        request_data['receiver'], 
        # Subject of the email
        request_data['subject'],
        # Body of the email
        request_data['bodyMessage'], 
        # Email address of the sender
        # Leave this paramter out if using environment variable 'EMAIL_ADDRESS'
        os.getenv('VITE_EMAIL') 
    )

    # Add HTML
    new_mail.add_html_message(request_data['bodyHTML'])

    # If using HTML file
    # new_mail.add_html_file('/path/to/your/html/file')

    # Print SendMail object to confirm email
    print(new_mail)

    # Send the email
    # Leave this parameter out if using environment variable 'EMAIL_PASSWORD'
    new_mail.send(os.getenv('VITE_EMAIL_PASSWORD'))