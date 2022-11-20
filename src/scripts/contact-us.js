/* SmtpJS.com - v3.0.0 */
import { SendEmail } from "./smtp.js";

var contactUs = document.getElementById("contact-us");

// on submit for contact
if (contactUs !== null) {    
    contactUs.onsubmit = function (event) {

        event.preventDefault();
        const firstName = document.getElementById('first-name')?.value;
        const lastName = document.getElementById('last-name')?.value;
        const email = document.getElementById('email')?.value;
        const subject = document.getElementById('subject').value;
        var message = document.getElementById('message')?.value;
        message = message + "<br/> sent from " + firstName + " " + lastName +
            "<br/> email address: " + email;         

        SendEmail(subject, message);

        // reset form
        document.getElementById('first-name').value = "";
        document.getElementById('last-name').value = "";
        document.getElementById('email').value = "";
        document.getElementById('subject').value = "";
        document.getElementById('message').value = "";
        
        //console.log(firstName + " " + lastName + " " + email + " " + subject + " " + message);
    };  
}