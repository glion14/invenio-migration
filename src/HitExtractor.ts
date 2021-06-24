import {plainToClass} from "class-transformer";
import Hit from "./Hit";
import Files from "./Files";
import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import FileDownloader from "./FileDownloader";

export default class HitExtractor {
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

        // continue with uploading files to the draft from local storage

        // verify files metadata

    }

    async retrieveFileEntries(fileLink: string): Promise<Files> {
        const token = process.env.RDM_TOKEN;

        const axiosConfig: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        return await axios.get(fileLink, axiosConfig)
            .then(response => plainToClass(Files, response.data));
    }
}