import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

const sendgrid = getStore({
  name: "sendgrid",
  siteID: "8265c3b5-c9da-4c35-9506-4b397bdf9821",
  token: "nfp_zgsyJfwoH4pjhrTachdm5hnUXWWL4nsy4ade",
});

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  switch (event.httpMethod) {
    case "POST":
      try {
        const rawData = event.body?.trim();
        const eventData = JSON.parse(rawData || "[]");

        await sendgrid.setJSON("email", eventData);

        const email = await sendgrid.get("email");

        console.log("Event Data Stored:", email);

        return {
          statusCode: 201,
          body: JSON.stringify(email),
        };
      } catch (error) {
        console.error("Error parsing JSON or storing data:", error);
        return {
          statusCode: 400,
          body: JSON.stringify({
            message: "Bad request. Invalid JSON data provided.",
          }),
        };
      }

    case "GET":
      const emailRaw = await sendgrid.get("email");
      const emailTrim = emailRaw?.trim();
      const email = JSON.parse(emailTrim || "[]");

      return {
        statusCode: 200,
        body: JSON.stringify(email),
      };

    case "DELETE":
      await sendgrid.setJSON("email", []);
      return {
        statusCode: 202,
        body: JSON.stringify({
          message: "Email deleted successfully.",
        }),
      };

    default:
      return {
        statusCode: 403,
        body: JSON.stringify({ message: "Request forbidden." }),
      };
  }
};

export { handler };
