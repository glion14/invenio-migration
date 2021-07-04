import fs from 'fs';
import axios, {AxiosRequestConfig} from "axios";
import Files from "./Files";
import {plainToClass} from "class-transformer";
import {ApiGateway} from "./ApiGateway";

export default class FileDownloader extends ApiGateway {

    private temporaryDirectory = "./tmp";
    /**
     * Downloads file binary, creates temporary directory and writes the binary to it with the same filename.
     * @param filename
     * @param hitId
     */
    async downloadSingleFile(filename: string, hitId: string): Promise<void> {
        const axiosConfig: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${this.sourceToken}`
            }
        }

        const filesPath = `${this.sourceHost}/api/records/${hitId}/files/${filename}/content`;
        const binary = await axios.get(filesPath, axiosConfig);

        this.createTmpDirectory(this.temporaryDirectory)

        return fs.writeFileSync(`${this.temporaryDirectory}/${filename}`, binary.data);
    }

    /**
     * Fetches all files from source repository
     * @param fileLink
     */
    async retrieveFileEntries(fileLink: string): Promise<Files> {
        const axiosConfig: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${this.sourceToken}`
            }
        }
        return await axios.get(fileLink, axiosConfig)
            .then(response => plainToClass(Files, response.data));
    }

    /**
     * Cleans up downloaded files on machine
     */
    cleanUpDownloadedFiles() {
        this.cleanUpTmpDirectory(this.temporaryDirectory);
    }

    private createTmpDirectory(dirPath: string) {
        if (fs.existsSync(dirPath)){
            this.cleanUpTmpDirectory(dirPath)
        }

        fs.mkdirSync(dirPath);
    }

    private cleanUpTmpDirectory(dirPath: string) {
        if (fs.existsSync(dirPath)) {
            fs.rmdirSync(dirPath, { recursive: true });
        }
    }
}