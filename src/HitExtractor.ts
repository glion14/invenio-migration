import {classToPlain, plainToClass} from "class-transformer";
import Hit from "./Hit";
import Files from "./Files";
import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import FileDownloader from "./FileDownloader";
import RecordDraft from "./RecordDraft";
import FileUploader from "./FileUploader";

export default class HitExtractor {
    private token: string = process.env.RDM_TOKEN;
    private readonly fileDownloader: FileDownloader;
    private readonly fileUploader: FileUploader;

    constructor(sourceHost: string, targetHost: string) {
        this.fileDownloader = new FileDownloader(sourceHost);
        this.fileUploader = new FileUploader(targetHost);
    }

    async process(hit: Hit, hitId: string) {
        // check files and get entries to objects
        const fileLink = hit.getFileLink();
        const files: Files = await this.retrieveFileEntries(fileLink);
        console.log(files);

        // download files one by one to local storage
        files.getEntries()
            .forEach(file => this.fileDownloader.downloadSingleFile(file.key, hitId))


        // start creating a draft with Hit object
        const recordDraft = new RecordDraft(hit)
        const baseUrl = "https://inveniordm.web.cern.ch/api/records"


        await this.pushInitialDraftRecord(recordDraft, baseUrl)
            //signal upload of all files
            .then(draftId => this.fileUploader.startFileUploading(files, draftId))
            //iterate and upload all files
            .then(draftId => {
                console.info(`Draft id -> ${draftId}`)
                files.getEntries().forEach(file => {
                    console.info(`Uploading file ${file.key}`)
                    this.fileUploader.uploadSingleFile(file.key, draftId)
                        .then(ignored => this.fileUploader.confirmUpload(file.key, draftId))
                    //maybe logging of progress ?
                })
            })

            .catch(reason => console.error(reason))

        // verify files metadata



    }

    async retrieveFileEntries(fileLink: string): Promise<Files> {
        const axiosConfig: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        }
        return await axios.get(fileLink, axiosConfig)
            .then(response => plainToClass(Files, response.data));
    }

    async pushInitialDraftRecord(recordDraft: RecordDraft, newRepoUrl: string): Promise<string> {
        const axiosPostConfig: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
        }

        return await axios.post(newRepoUrl, classToPlain(recordDraft), axiosPostConfig)
            .then(response => plainToClass(Hit, response.data))
            .then(record => record.getId())
    }
}