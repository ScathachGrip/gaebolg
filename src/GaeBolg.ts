import p from "phin";
import { version } from "../package.json";
import base from "./Base";
import baseImage from "./BaseImage";
import baseEndpoint from "./BaseEndpoint";

class GaeBolg {
  version: string;
  type: string[];
  h: string;
  p: string;
  c: string;
  n: string;
  hentai: string;
  porn: string;
  cute: string;
  nasuverse: string;
  hentaiImg: string[];
  pornImg: string[];
  cuteImg: string[];
  nasuverseImg: string[];
  rateLimited: string;
  constructor() {
    this.version = version;
    this.type = baseImage.TYPE;
    this.h = baseEndpoint.h;
    this.p = baseEndpoint.p;
    this.c = baseEndpoint.c;
    this.n = baseEndpoint.n;
    this.hentai = base.HENTAI;
    this.porn = base.PORN;
    this.cute = base.CUTE;
    this.nasuverse = base.NASUVERSE;
    this.hentaiImg = baseImage.HENTAI_IMAGE;
    this.pornImg = baseImage.PORN_IMAGE;
    this.cuteImg = baseImage.CUTE_IMAGE;
    this.nasuverseImg = baseImage.NASUVERSE_IMAGE;
    this.rateLimited = "You are being rate limited, please try again later";
  }

  /**
       * @param {string} url
       * @param {string} image
       * @returns {Promise<string>}
       * @memberof GaeBolg
       * @example const gaeBolg = new GaeBolg();
          gaeBolg.request("hentai", "yuri").then(console.log);
       */
  async request(url: string, image: string): Promise<string> {
    const response = await p ({
      url: `${url}/${image}/${process.env.REDACTED}`,
      parse: "json"
    });
    const res = response.body as string[];
    const randomData = res[Math.floor(Math.random() * res.length)];
    return randomData;
  }

  /**
     * @param {string} word 
     * @returns {string | void}
     */
  redacted(word: string | null): string | void {
    if (word && word.includes(String(process.env.REDACTED))) {
      return word.replace(`${process.env.REDACTED}`, `${process.env.SHOW_REDACTED}`);
    }
  }

  /**
     * @param {string} err
     * @param {string | null} ua
     * @returns {object}
     */
  fail(err: string, ua: string | null): object {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: `An error occured: ${err}`,
        user_agent: ua
      })
    };
  }
}

export default GaeBolg;