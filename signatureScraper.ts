import fs from 'fs'
import path from 'path'
import {Utils} from './utils';
const extractUrls = require("extract-urls");
const colors = require('colors/safe')
import { myChecks } from './myChecks';
export class signatureScraper {
    folderToScrape = 'siteDocs.site'
    directoryPath: string = path.join(__dirname, this.folderToScrape);
    alreadyCheckedWallet = false
    whiteListChecks = myChecks.myChecksArray()
    constructor() {
    }
    /**
     * @description get file content
     * @param fileName file to scrape content from
     */
    getFileContent(fileName: any , directoryPath : string ,) {
        const fileContent = fs.readFileSync(directoryPath + '\\' + fileName, 'utf-8')
        this.checkForWhitelist(fileContent, fileName ,directoryPath + '\\' + fileName )
        const apiRegex = /https?:\/\/[^\s]+__api\/graphql/g;
        const grapghQLmatches = fileContent.match(apiRegex)
        if(grapghQLmatches){
            Utils.log(grapghQLmatches)
        }
        var matches = extractUrls(fileContent)
        if (matches && matches.length > 0) {
            const updatedMatchs = this.filterArray(matches, fileName)
            this.handleUrls(updatedMatchs)
        }
    }
    /**
     * @description get folder content
     * @param directoryPath 
     * @returns folder content
     */
    getFolderContents(directoryPath: string) {
        const mainFolderFiles: Array<string> = []
        //passsing directoryPath and callback function
        const files = fs.readdirSync(directoryPath, 'utf-8')
        files.forEach(function (file) {
            // Do whatever you want to do with the file
            mainFolderFiles.push(file)
        });
        return mainFolderFiles
    }
    /**
     * @description got files content from the main folder
     */
    scrapeFiles(directoryPath : any) {
        const filesArray = this.getFolderContents(directoryPath)
        filesArray.map((res: string) => {
            if (res !== 'js' && res !== 'css' && res !== 'images' && !res.endsWith('ico') && res !== 'fonts') {
                this.getFileContent(res , directoryPath)
            }
            if (res === 'js') {
                const directoryPath = path.join(__dirname + '\\' + this.folderToScrape, 'js');
                return this.scrapeFiles(directoryPath)
            }
        })
    }
    /**
     * @description filter the array from the impurities that was scrapped from project
     * @param matches the array of urls
     * @returns {Array} array of filtered url
     */
    filterArray(matches: any, fileName: any): Array<any> {
        const updatedMatches: any = []
        const impurities = ['(', ')']
        matches.map((urls: any) => {
            // if the url contain any of whitelist checks
            if (urls) {
                this.whiteListChecks.forEach(element => {
                    if (urls.toLowerCase().includes(element.toLowerCase())) {
                        Utils.log('Whitelist url sus : ' + urls + ' contains ' + element)
                    }
                });
            }
            // clearing urls impurities
            impurities.forEach(impurities => {
                if (urls.includes(impurities)) {
                    urls = urls.replace(impurities, '')
                }
            })
            if (urls.endsWith('.')) {
                urls = urls.replace(/.$/, '')
            }
            updatedMatches.push(`fileName : ${fileName} |  urls : ${urls}`)
        })
        return updatedMatches
    }
    /**
     * @description append urls to the urls text file
     * @param urlArray urls array to save
     */
    handleUrls(urlArray: any) {
        fs.appendFileSync('urls.txt', '\n' + urlArray.join('\n'))
    }
    /**
     * @description check if content contains any of whitelist checks
     * @param contentToCheck 
     * @param fileName 
     */
    checkForWhitelist(contentToCheck: string, fileName: string , directoryPath:any) {
        // check if file contnet contains any fo checks
        if(fileName.includes('download')){
            fs.renameSync(directoryPath, directoryPath.replace('.download',''))
            fileName = fileName.replace('.download','')
        }
        const containsChecks = this.whiteListChecks.some(checks => contentToCheck.toLowerCase().includes(checks))
        if (!containsChecks) return
        Utils.log('---------------------------------------' + fileName + '---------------------------------------')
        const regex = contentToCheck.toLowerCase().match(/(\b0x[a-f0-9]{40}\b)/g)
        if (regex) {
            const indexOfFoundWord = contentToCheck.toLowerCase().indexOf(regex[1])
            let postionWord : string = ''
            for (var i = indexOfFoundWord; i < indexOfFoundWord + 200 ; i++){
                postionWord += contentToCheck[i]
            }
            Utils.log('Found a wallet in ' + fileName +" || The Wallet "+regex  +  " || Reference : " + colors.red(postionWord.replace(/\s/g, '')))
        }
        this.whiteListChecks.forEach(element => {
            if (contentToCheck.toLowerCase().includes(element.toLowerCase())) {
                const indexOfFoundWord = contentToCheck.toLowerCase().indexOf(element)
                let postionWord : string = ''
                for (var i = indexOfFoundWord  ; i < indexOfFoundWord + 50 ; i++){
                    postionWord += contentToCheck[i]
                }
              
                Utils.log('filename : ' + fileName + '  || contains ' + element + '   || Reference : ' + colors.red(postionWord.replace(/\s/g, '')) )
            }
        });
        Utils.log('----------------------------------------------------------------------------------------------')
    }
    
    getDirName(foldername : string){
       const  directoryPath: string = path.join(__dirname, foldername);
        return directoryPath
    }

}
// new signatureScraper().scrapeFiles(path.join(__dirname, 'siteDocs.site'))
// const lineReader = require('line-reader');
  
// eachLine() method call on gfg.txt
// It got a callback function
// Printing content of file line by line
// on the console
// lineReader.eachLine('main.js', (line:any, last:any) => {
//     Utils.log(line);
//     if(line.includes('Tree')){
//         Utils.log(line)
//     }
// });

// 
// node-site-downloader.cmd download -s https://www.thebananas.xyz/ -d https://www.thebananas.xyz/ -o siteDocs -v 
// node-site-downloader.cmd download -s https://www.juuni.xyz/mint -d https://www.juuni.xyz -o siteDocs -v 