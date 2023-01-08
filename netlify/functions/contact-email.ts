import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { env } from "process";
import fetch from "node-fetch";

const handler: Handler = async function (event) {
    console.log("inside function");
    if (event.body === null) {
        return {
            statusCode: 400,
            body: JSON.stringify("Payload required"),
        };
    }

    const requestBody = JSON.parse(event.body) as {
        to: string;
        from: string;
        subject: string;
        parameters: {            
            name: string;            
            email: string;
            message: string;
        }
    };

    console.log(requestBody);
    if (process.env.NETLIFY_EMAILS_SECRET) {

        await fetch(
            `${process.env.URL}/.netlify/functions/emails/contact`,
            {
              headers: {
                "netlify-emails-secret": process.env.NETLIFY_EMAILS_SECRET,
              },
              method: "POST",
              body: JSON.stringify({
                from: requestBody.from,
                to: requestBody.to,
                subject: requestBody.subject,
                parameters: {
                  subject: requestBody.subject, 
                      name: requestBody.parameters.name, 
                      email: requestBody.parameters.email, 
                      message: requestBody.parameters.message
                },
              }),
            }
          );
    } else {
        return {
            statusCode: 400,
            body: JSON.stringify("process.env.NETLIFY_EMAILS_SECRET is not set")
        }
    }


    return {
        statusCode: 200,
        body: JSON.stringify("Contact email sent!"),
    };
};

export { handler };