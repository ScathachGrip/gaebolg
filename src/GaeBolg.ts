import p from "phin";
import { version } from "../package.json";
import base from "./Base";
import baseImage from "./BaseImage";
import baseEndpoint from "./BaseEndpoint";
import { IGaeBolgObject, IMinigamesData } from "./interfaces";

class GaeBolg {
  version: string;
  type: string[];
  h: string;
  p: string;
  c: string;
  n: string;
  m: string;
  hentai: string;
  porn: string;
  cute: string;
  nasuverse: string;
  minigames: string;
  hentaiImg: string[];
  pornImg: string[];
  cuteImg: string[];
  nasuverseImg: string[];
  minigamesImg: string[];
  constructor() {
    this.version = version;
    this.type = baseImage.TYPE;
    this.h = baseEndpoint.h;
    this.p = baseEndpoint.p;
    this.c = baseEndpoint.c;
    this.n = baseEndpoint.n;
    this.m = baseEndpoint.m;
    this.hentai = base.HENTAI;
    this.porn = base.PORN;
    this.cute = base.CUTE;
    this.nasuverse = base.NASUVERSE;
    this.minigames = base.MINIGAMES;
    this.hentaiImg = baseImage.HENTAI_IMAGE;
    this.pornImg = baseImage.PORN_IMAGE;
    this.cuteImg = baseImage.CUTE_IMAGE;
    this.nasuverseImg = baseImage.NASUVERSE_IMAGE;
    this.minigamesImg = baseImage.MINIGAMES_IMAGE;
  }

  /**
       * @param {string} url
       * @param {string} image
       * @returns {Promise<string>}
       */
  async request(url: string, image: string): Promise<string> {
    const response = await p ({
      url: `${url}/${image}/${process.env.REDACTED}`,
      parse: "json"
    });
    // console.log(`${url}/${image}/${process.env.REDACTED}`);
    const res = response.body as string[];
    const randomData = res[Math.floor(Math.random() * res.length)];
    return randomData;
  }

  /**
       * @param {string} url
       * @param {string} image
       * @returns {Promise<string>}
       */
  async requestObject(url: string, image: string): Promise<object> {
    const response = await p ({
      url: `${url}/${image}/${process.env.REDACTED}`,
      parse: "json"
    });
    const res = response.body as unknown as { data_e: string[]; data_q: string[] };
    const rating = [res.data_e, res.data_q];
    const randomRating = rating[Math.floor(Math.random() * rating.length)];
    
    let isExplicit;
    if (randomRating === res.data_e) isExplicit = "SR";
    else isExplicit = "SSR";

    const randomCharacter = randomRating[Math.floor(Math.random() * randomRating.length)] as unknown as IGaeBolgObject;
    const randomCharacterImage = randomCharacter.image[Math.floor(Math.random() * randomCharacter.image.length)];
    const randomCharacterTags = randomCharacter.tags.replace(/_\(.*/g, "").replace(/_/g, " ");

    const minigamesData: IMinigamesData = {
      character: this.toTitleCase(randomCharacterTags),
      url: randomCharacterImage,
      rating: isExplicit,
    };

    return minigamesData;
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
   * @param {string} str
   * @returns {string}
   */
  
  toTitleCase(str: string): string {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        txt = txt.replace(/_/g, " ");
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
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