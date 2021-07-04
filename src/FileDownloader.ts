import fs from "fs";
import axios, {AxiosRequestConfig} from "axios";
import Files from "./Files";
import {plainToClass} from "class-transformer";
import {ApiGateway} from "./ApiGateway";
import path from "path";

export default class FileDownloader extends ApiGateway {

    private temporaryDirectory = "./tmp";
    /**
     * Downloads file binary, creates temporary directory and writes the binary to it with the same filename.
     * @param filename
     * @param hitId
     */
    async downloadSingleFile(filename: string, hitId: string): Promise<void> {

        const filesPath = `${this.sourceHost}/api/records/${hitId}/files/${filename}/content`;
        const binary = await axios.get(filesPath);

        this.createTmpDirectory(this.temporaryDirectory)

        return fs.writeFileSync(`${this.temporaryDirectory}/${filename}`, binary.data);
    }

    /**
     * Fetches all files from source repository
     * @param fileLink
     */
    async retrieveFileEntries(fileLink: string): Promise<Files> {
        return await axios.get(fileLink)
            .then(response => plainToClass(Files, response.data));
    }

    /**
     * Cleans up downloaded files on machine
     */
    cleanUpDownloadedFiles() {
        this.cleanUpTmpDirectory(this.temporaryDirectory);
    }

    private createTmpDirectory(dirPath: string) {
        if (!fs.existsSync(dirPath)){
            fs.mkdirSync(dirPath);
        }
    }

    private cleanUpTmpDirectory(dirPath: string) {
        if (fs.existsSync(dirPath)) {

            fs.readdirSync(dirPath).forEach(file => {
                fs.rmSync(path.join(dirPath, file), {force: true});
            });

            fs.rmdirSync(dirPath);
        }
    }
}