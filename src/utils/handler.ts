import { valid_image_hentai, valid_image_porn, valid_image_nasuverse } from "../constant/data";
import { version, name } from "../../package.json";


export async function errorNoParams(ua: string | null) {
  return {
    statusCode: 400,
    body: JSON.stringify({
      success: false,
      version: `${name} ${version}`,
      params: [
        {
          type: "hentai",
          image: valid_image_hentai
        },
        {
          type: "porn",
          image: valid_image_porn
        },
        {
          type: "nasuverse",
          image: valid_image_nasuverse
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
