import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import JsonDBWrapper from "../../lib/db/json_db";
import path = require("path");

const emailDB = new JsonDBWrapper(path.join("public", "emails.json"));

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  switch (event.httpMethod) {
    case "POST":
      try {
        const rawData = event.body?.trim();
        const eventData = JSON.parse(rawData || "[]");

        await emailDB.push("/email", eventData);

        console.log("Event Data Stored:", eventData);
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
      const emailData = await emailDB.get("/email");
      return {
        statusCode: 200,
        body: JSON.stringify(emailData),
      };

    case "DELETE":
      await emailDB.push("/email", "");
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
