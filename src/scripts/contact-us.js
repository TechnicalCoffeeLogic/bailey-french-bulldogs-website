/* SmtpJS.com - v3.0.0 */
import { SendEmail } from "./smtp.js";

var contactUs = document.getElementById("contact-us");

// on submit for contact
if (contactUs !== null) {
    contactUs.onsubmit = function (event) {

        let error = false;
        let errorDesc = "";

        event.preventDefault();
        const firstName = document.getElementById('first-name')?.value;
        if (!firstName || firstName == "") {
            errorDesc = "First name cannot be blank.";
            error = true;
        }

        const lastName = document.getElementById('last-name')?.value;
        if (!lastName || lastName == "") {
            errorDesc = "Last name cannot be blank.";
            error = true;
        }

        const email = document.getElementById('email')?.value;
        if (!email || email == "") {
            errorDesc = "Email address cannot be blank.";
            error = true;
        }

        let mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!email.match(mailFormat)) { 
            errorDesc = "Email address does not contain correct format. (test@example.com)"
            error = true;
        }

        const subject = document.getElementById('subject').value;
        if (!subject || subject == "") {
            errorDesc = "Subject cannot be blank";
            error = true;
        }

        var message = document.getElementById('message')?.value;
        if (!message || message == "") {
            errorDesc = "Message cannot be blank";
            error = true;
        }

        message = message + "<br/> sent from " + firstName + " " + lastName +
            "<br/> email address: " + email;

        if (!error) {
            SendEmail(subject, message);
            // reset form
            document.getElementById('first-name').value = "";
            document.getElementById('last-name').value = "";
            document.getElementById('email').value = "";
            document.getElementById('subject').value = "";
            document.getElementById('message').value = "";
        } else {
            alert(errorDesc);
            error = false;
        }



        //console.log(firstName + " " + lastName + " " + email + " " + subject + " " + message);
    };
}