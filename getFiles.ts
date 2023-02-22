import {signatureScraper} from "./signatureScraper";
import path from "path";
import fs from 'fs'
import {Utils} from "./utils";
const {exec} = require('child_process');
export class getWebsiteContent extends signatureScraper {
    directoryPath: string = path.join(__dirname, this.folderToScrape);
    folderToScrape2: any
    siteNameToMonitor: string
    constructor(siteNameToMonitor: string) {
        super()
        this.siteNameToMonitor = siteNameToMonitor
    }
    /**
     * 
     */
    checkIfAlreadyUsingFileName() {
        const doesExists = fs.existsSync(this.directoryPath);
        if (doesExists) {
            this.folderToScrape2 = this.folderToScrape + "-" + Utils.getRandomString(2)
            return this.folderToScrape2
        }
        return this.folderToScrape
    }
    /**
     * 
     * @returns 
     */
    async filterFiles(folderToFilter: string) {
        Utils.log('Filtring Folder content...')
        const directoryPath: string = path.join(__dirname, folderToFilter);
        return new Promise(resolve => {
            const files = this.getFolderContents(directoryPath)
            files.map(res => {
                if (res === 'media' || res === 'images' || res === 'fonts' || res === 'css') {
                    try {
                        fs.rmSync(directoryPath + '\\' + res, {recursive: true, force: true})
                    } catch (e) {
                    }
                }
                if (res.includes('image') || res.includes('png') || res.includes('jpeg') || res.includes('m4a') || res.includes('mp4') || res.includes('mp3') || res.includes('webm')) {
                    try {
                        fs.unlinkSync(directoryPath + '\\' + res)
                    } catch (e) {
                    }
                }
            })
            resolve(true);
        })
    }
    /**
     * 
     * @returns 
     */
    writeWebsiteFiles() {
        return new Promise(resolve => {
            const folderNameToSaveTo = this.checkIfAlreadyUsingFileName()
            exec(`node-site-downloader.cmd download -s ${this.siteNameToMonitor} -d ${this.siteNameToMonitor} -o ${folderNameToSaveTo} -v  --output-folder-suffix `, async (err: any, stderr: any, stdout: any) => {
                Utils.log('Extracted Website Files')
                const directoryPath: string = path.join(__dirname, folderNameToSaveTo);
                fs.renameSync(directoryPath + '.site', directoryPath)
                await this.filterFiles(folderNameToSaveTo)
                const folders = this.returnFoldersContent();
                this.compare2Files(folders)
                resolve(stdout)
            })
        })
    }
    /**
     * 
     * @param folderToIterate 
     * @returns 
     */
    getFolderFilesLength(folderPath: any) {
        let folderFilesLength: any = []
        const folderToIterate = this.getFolderContents(folderPath);
        folderToIterate.forEach((res: any) => {
            if (res) {
                if (res === 'js') {
                    const jsFilesLength = this.getFolderFilesLength(folderPath + '\\' + 'js')
                    folderFilesLength = folderFilesLength.concat(jsFilesLength)
                } else {
                    const FileContent = fs.readFileSync(folderPath + '\\' + res, 'utf-8');
                    folderFilesLength.push({fileLength: FileContent.toString().length, fileName: res})
                }
            }
        })
        return folderFilesLength
    }
    /**
     * 
     * @returns 
     */
    returnFoldersContent() {
        let folder2FolderFilesLength: any
        if (this.folderToScrape2) {
            folder2FolderFilesLength = this.getFolderFilesLength(this.folderToScrape2)
        }
        const folder1FolderFilesLength = this.getFolderFilesLength(this.folderToScrape);
        return {folder1: folder1FolderFilesLength, folder2: folder2FolderFilesLength}
    }
    /**
     * 
     * @param folders 
     */
    compare2Files(folders: any) {
        if (!this.folderToScrape2) {
            return Promise.resolve()
        }
        Utils.log('Comparing  : ' + this.folderToScrape + ' With : ' + this.folderToScrape2)
        if (folders.folder1.length !== folders.folder2.length) {
            Utils.log('--------------------------------------There is something worng with files , there is some files missing to be able to compare the 2 files--------------------------------------', true)
        }
        for (var i = 0; i < folders.folder1.length; i++) {
            if (folders.folder1[i]?.fileName === folders.folder2[i]?.fileName) {
                if (Math.abs(folders.folder1[i].fileLength - folders.folder2[i].fileLength) > 5) {
                    Utils.log('There is a length mismatch in this folder name : ' + folders.folder1[i].fileName, true)
                    const folderToScrapePath = folders.folder1[i].fileName.includes('.js') ? this.folderToScrape2 + '\\js' : this.folderToScrape2
                    this.getFileContent(folders.folder1[i].fileName, folderToScrapePath)
                }
            }
        }
        Utils.log('Updating Old File')
        fs.rmSync(this.getDirName(this.folderToScrape), {recursive: true, force: true})
        fs.renameSync(this.getDirName(this.folderToScrape2), this.getDirName(this.folderToScrape))
    }
}
