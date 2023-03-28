import "dotenv/config";
import GaeBolg from "./GaeBolg";
import RateLimiter  from "async-ratelimiter";
import Redis from "ioredis";
import { getClientIp } from "request-ip";
import { APIGatewayEvent } from "aws-lambda";
import { successDelivered, errorNoParams, errorTagsParams, rateLimitHit } from "./utils/handler";
import { iParams, valid_type,
  valid_image_hentai, valid_image_porn, valid_image_nasuverse } from "./constant/data";

const rateLimiter = new RateLimiter({
  db: new Redis(process.env.REDIS_URL as string),
  max: 3,
  duration: 10000
});

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
      //const user = event.headers["client-ip"] as string;
      const clientIp = getClientIp(event) || "NA";
      const limit = await rateLimiter.get({ id: clientIp });
      if (!limit.remaining) return rateLimitHit(userAgent, clientIp);
      else {
        let baseUrl = "", image = "";
        if (gateway.specs.type === "hentai") 
          baseUrl = "https://melony.scathach.id", image = gateway.specs.image;
        else if (gateway.specs.type === "porn") 
          baseUrl = "https://tristan.scathach.id", image = gateway.specs.image;
        else if (gateway.specs.type === "nasuverse") 
          baseUrl = "https://emiya.scathach.id", image = gateway.specs.image;

        const response = await gaeBolg.request(baseUrl, image);
        return successDelivered(response, userAgent);
      }
      
    } catch (e) {
      const error = e as string;
      return gaeBolg.fail(gaeBolg.redacted(error.toString()) || error, userAgent);
    }
  }
}