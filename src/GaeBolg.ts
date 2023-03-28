import p from "phin";
import { version } from "../package.json";

class GaeBolg {
  version: string;
  constructor() {
    this.version = version;
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