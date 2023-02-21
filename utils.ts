const colors = require('colors/safe')
export class Utils {
    /**
    * @description : generate random string 
    * @param {Number} length length of the randomn string to be generated
    * @returns {String}  random string 
    */
    static getRandomString(length: any): string {
        const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        return result;
    }
    /**
      * @description sleep for specifed time 
      * @param {*} ms time to sleep in milli secounds
      */
    static sleep(ms: any) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    /**
    * Cli Logger
    * @param message message to be logged
    */
    static log = (message: any, foundDifferences = false) => {
        let type = colors.blue(`[LOGGER]`)
        if (foundDifferences) type = colors.green(`[Found-Difference]`)
        const data = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds() + ":" + new Date().getMilliseconds()
        console.log(type + `[${data}]` + message);
    }
}