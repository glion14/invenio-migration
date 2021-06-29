import fs from 'fs';
import axios, {AxiosRequestConfig} from "axios";

export default class FileDownloader {
    private readonly host;
    private readonly token = process.env.RDM_TOKEN;

    constructor(hostUrl: string) {
        this.host = hostUrl
    }

    /**
     * Downloads file binary, creates temporary directory and writes the binary to it with the same filename.
     * @param filename
     * @param hitId
     */
    async downloadSingleFile(filename: string, hitId: string): Promise<void> {
        const axiosConfig: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        }

        const filesPath = `${this.host}/api/records/${hitId}/files/${filename}/content`;
        const binary = await axios.get(filesPath, axiosConfig);

        const temporaryDirectory = "./tmp"
        if (!fs.existsSync(temporaryDirectory)){
            fs.mkdirSync(temporaryDirectory);
        }

        fs.writeFileSync(`${temporaryDirectory}/${filename}`, binary.data);
    }
}