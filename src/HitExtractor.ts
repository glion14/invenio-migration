import {classToPlain, plainToClass} from "class-transformer";
import Hit from "./Hit";
import Files from "./Files";
import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import FileDownloader from "./FileDownloader";
import RecordDraft from "./RecordDraft";

export default class HitExtractor {
    private token: string = process.env.RDM_TOKEN;
    private readonly fileDownloader: FileDownloader;

    constructor() {
        this.fileDownloader = new FileDownloader();
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

        // push draft and get it's new ID

        // continue with uploading files to the draft from local storage

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

    async pushInitialDraftRecord(recordDraft: RecordDraft, newRepoUrl: string): Promise<void> {
        const axiosPostConfig: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
        }

        return await axios.post(newRepoUrl, classToPlain(recordDraft), axiosPostConfig)
            .then(result => console.log(result))
    }
}