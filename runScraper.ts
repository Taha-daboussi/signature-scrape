import path from "path";
import {signatureScraper} from "./signatureScraper";
import {getWebsiteContent} from "./getFiles";
import fs from 'fs'
const {exec} = require('child_process');
const siteNameToMonitor = 'https://utopia.io/'
const stuffs = new getWebsiteContent()
const proofScraper = new signatureScraper()
if(fs.existsSync('./siteDocs.site')){
    fs.rmSync('D:\\Desktop\\signature scrape\\signature scrape\\siteDocs.site', {recursive: true, force: true})
}
exec(`node-site-downloader.cmd download -s ${siteNameToMonitor} -d ${siteNameToMonitor} -o siteDocs -v  --output-folder-suffix `, async (err: any, stderr: any, stdout: any) => {
    await stuffs.filterFiles('siteDocs.site')
    proofScraper.scrapeFiles(path.join(__dirname, 'siteDocs.site'))
    return process.exit()
})

