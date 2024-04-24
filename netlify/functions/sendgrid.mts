import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  switch (event.httpMethod) {
    case "POST":
      try {
        const rawData = event.body?.trim();
        const eventData = JSON.parse(rawData || "[]");

        const sendgrid = getStore("sendgrid");

        await sendgrid.setJSON("email", eventData);

        const email = await sendgrid.get("email");

        console.log("Event Data Stored:", email);
        return {
          statusCode: 201,
          body: JSON.stringify({ message: "Success", data: eventData }),
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
      const sendgrid = getStore("sendgrid");
      const email = await sendgrid.get("email");
      return {
        statusCode: 200,
        body: JSON.stringify(email),
      };

    case "DELETE":
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
