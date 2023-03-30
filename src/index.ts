import "dotenv/config";
import GaeBolg from "./GaeBolg";
import RateLimiter  from "async-ratelimiter";
import Redis from "ioredis";
import { getClientIp } from "request-ip";
import { APIGatewayEvent } from "aws-lambda";
import { successDelivered, errorNoParams, errorTagsParams, rateLimitHit } from "./utils/handler";
import { iParams } from "./constant/data";

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

  if (!gaeBolg.type.includes(gateway.specs.type)) return errorNoParams(userAgent);

  else if (gateway.specs.type === gaeBolg.h
    && !gaeBolg.hentaiImg.includes(gateway.specs.image)) return errorTagsParams(gaeBolg.h);

  else if (gateway.specs.type === gaeBolg.p
    && !gaeBolg.pornImg.includes(gateway.specs.image)) return errorTagsParams(gaeBolg.p);

  else if (gateway.specs.type === gaeBolg.c
    && !gaeBolg.cuteImg.includes(gateway.specs.image)) return errorTagsParams(gaeBolg.c);

  else if (gateway.specs.type === gaeBolg.n
    && !gaeBolg.nasuverseImg.includes(gateway.specs.image)) return errorTagsParams(gaeBolg.n);

  else {
    try {
      //const user = event.headers["client-ip"] as string;
      const clientIp = getClientIp(event) || "NA";
      const limit = await rateLimiter.get({ id: clientIp });
      if (!limit.remaining) return rateLimitHit(userAgent, clientIp);
      else {
        let baseUrl = "", image = "";
        if (gateway.specs.type === gaeBolg.h) 
          baseUrl = gaeBolg.hentai, image = gateway.specs.image;
        else if (gateway.specs.type === gaeBolg.p) 
          baseUrl = gaeBolg.porn, image = gateway.specs.image;
        else if (gateway.specs.type === gaeBolg.c)
          baseUrl = gaeBolg.cute, image = gateway.specs.image;
        else if (gateway.specs.type === gaeBolg.n) 
          baseUrl = gaeBolg.nasuverse, image = gateway.specs.image;

        const response = await gaeBolg.request(baseUrl, image);
        return successDelivered(response, userAgent);
      }
      
    } catch (e) {
      const error = e as string;
      return gaeBolg.fail(gaeBolg.redacted(error.toString()) || error, userAgent);
    }
  }
}