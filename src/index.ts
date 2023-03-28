import "dotenv/config";
import GaeBolg from "./GaeBolg";
import { APIGatewayEvent } from "aws-lambda";
import limiter from "lambda-rate-limiter";
import { successDelivered, errorNoParams, errorTagsParams } from "./utils/handler";
import { iParams, valid_type,
  valid_image_hentai, valid_image_porn, valid_image_nasuverse } from "./constant/data";

const gaeBolg = new GaeBolg();

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
      const rateLimiter = limiter({
        interval: 60000,
        uniqueTokenPerInterval: 500,
      });

      const user = event.headers["client-ip"] || event.requestContext.identity.sourceIp as string;
      console.log(user);
      rateLimiter
        .check(10, user).then(console.log)
        .catch(() => {
          throw new Error("Too many requests");
        })
        .then(() => {
          console.log("Request accepted");
        });
      
      let baseUrl = "", image = "";
      if (gateway.specs.type === "hentai") 
        baseUrl = "https://melony.scathach.id", image = gateway.specs.image;
      else if (gateway.specs.type === "porn") 
        baseUrl = "https://tristan.scathach.id", image = gateway.specs.image;
      else if (gateway.specs.type === "nasuverse") 
        baseUrl = "https://emiya.scdathach.id", image = gateway.specs.image;

      const response = await gaeBolg.request(baseUrl, image);
      return successDelivered(response, userAgent);
    } catch (e) {
      const error = e as string;
      return gaeBolg.fail(gaeBolg.redacted(error.toString()) || error, userAgent);
      
    }
  }
}