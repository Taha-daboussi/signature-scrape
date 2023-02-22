import {signatureScraper} from "./signatureScraper";
import {getWebsiteContent} from "./getFiles";
import {Utils} from "./utils";
import path from "path";
import fs from 'fs'
const cliArgs = process.argv.slice(2);
const myMode = cliArgs[0]
const {exec} = require('child_process');
const siteNameToMonitor = 'https://degenlooters.xyz'
const _getWebsiteContent = new getWebsiteContent(siteNameToMonitor)
const proofScraper = new signatureScraper();

(async () => {
    if (myMode === 'scraper') {
        if (fs.existsSync('./siteDocs.site')) {
            fs.rmSync('D:\\Desktop\\signature scrape\\signature scrape\\siteDocs.site', {recursive: true, force: true})
        }
        exec(`node-site-downloader.cmd download -s ${siteNameToMonitor} -d ${siteNameToMonitor} -o siteDocs -v  --output-folder-suffix `, async (err: any, stderr: any, stdout: any) => {
            await _getWebsiteContent.filterFiles('siteDocs.site')
            proofScraper.scrapeFiles(path.join(__dirname, 'siteDocs.site'))
            return process.exit()
        })
    } else {
        (async () => {
            while (true) {
                Utils.log('Getting Website File...')
                await _getWebsiteContent.writeWebsiteFiles()
                await Utils.sleep(3000)
            }
        })()
    }
})()
