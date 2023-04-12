import GaeBolg from ".././GaeBolg";
import { version, name } from "../../package.json";

const gaeBolg = new GaeBolg();
export async function errorNoParams(ua: string | null) {
  return {
    statusCode: 400,
    body: JSON.stringify({
      success: false,
      version: `${name} ${version}`,
      params: [
        {
          type: "hentai",
          image: gaeBolg.hentaiImg
        },
        {
          type: "porn",
          image: gaeBolg.pornImg
        },
        {
          type: "cute",
          image: gaeBolg.cuteImg
        },
        {
          type: "nasuverse",
          image: gaeBolg.nasuverseImg
        },
        {
          type: "minigames",
          image: gaeBolg.minigamesImg
        }
      ],
      message: "You didn't provide any parameters or it's invalid",
      message_again: "Type properties tells it all about nsfw returns or not",
      user_agent: ua
    }),
  };
}

export async function invalidParams(genre: string) {
  return {
    statusCode: 400,
    body: JSON.stringify({
      message: `No matching parameters for ${genre}`
    }),
  };
}

export async function errorTagsParams(genre: string) {
  return {
    statusCode: 400,
    body: JSON.stringify({
      message: `Invalid parameters for ${genre}`
    }),
  };
} 

export async function maybeError(genre: string) {
  return {
    statusCode: 400,
    body: JSON.stringify({
      message: `This parameter is not valid for ${genre}`
    }),
  };
} 

export async function successDelivered(url: string, userAgent: string | null) {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      success: true,
      url: url,
      user_agent: userAgent
    })
  };
}

export async function successDeliveredObject(data: object, userAgent: string | null) {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      success: true,
      data: data,
      user_agent: userAgent
    })
  };
}

export function rateLimitHit(userAgent: string | null, ip: string | null): object {
  return {
    statusCode: 429,
    body: JSON.stringify({
      success: false,
      message: "You have been rate limited",
      message_again: "There is a limit of 5 requests per 10 seconds",
      user_agent: userAgent,
      ip: ip,
    })
  };
}