import fs from 'fs';
import axios, {AxiosRequestConfig} from "axios";
import Files from "./Files";
import {plainToClass} from "class-transformer";
import {ApiGateway} from "./ApiGateway";

export default class FileDownloader extends ApiGateway {

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

        const temporaryDirectory = "./tmp"
        if (!fs.existsSync(temporaryDirectory)){
            fs.mkdirSync(temporaryDirectory);
        }

        return fs.writeFileSync(`${temporaryDirectory}/${filename}`, binary.data);
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

}