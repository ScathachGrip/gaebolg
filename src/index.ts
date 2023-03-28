import { APIGatewayEvent } from "aws-lambda";
import fetch from "node-fetch";
import { successDelivered, errorNoParams, errorTagsParams } from "./utils/handler";
import { iParams, valid_type,
  valid_image_hentai, valid_image_porn, valid_image_nasuverse } from "./constant/data";

export async function handler(
  event: APIGatewayEvent) {

  const userAgent = event.multiValueHeaders["user-agent"] ? event.multiValueHeaders["user-agent"][0] : null;
  const gateway = { specs: event.queryStringParameters as unknown as iParams };

  if (!valid_type.includes(gateway.specs.type)) return errorNoParams(userAgent);

  else if (gateway.specs.type === "hentai"
    && !valid_image_hentai.includes(gateway.specs.image)) return errorTagsParams("hentai");

  else if (gateway.specs.type === "porn"
    && !valid_image_porn.includes(gateway.specs.image)) return errorTagsParams("porn");

  else if (gateway.specs.type === "nasuverse"
    && !valid_image_nasuverse.includes(gateway.specs.image)) return errorTagsParams("nasuverse");

  else {
    try {
      let baseUrl = "", image = "";
      if (gateway.specs.type === "hentai") 
        baseUrl = "https://melony.scathach.id", image = gateway.specs.image;
      else if (gateway.specs.type === "porn") 
        baseUrl = "https://tristan.scathach.id", image = gateway.specs.image;
      else if (gateway.specs.type === "nasuverse") 
        baseUrl = "https://emiya.scathach.id", image = gateway.specs.image;

      // else return invalidParams(gateway.specs.type);

      const response = await fetch(`${baseUrl}/${image}/hey.json`);
      const res = await response.json();
      const randomData = res[Math.floor(Math.random() * res.length)];
      return successDelivered(randomData, userAgent);
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          message: `An error occured: ${error.message}`,
          user_agent: userAgent
        }),
      };
      
    }
  }
}