import fs from 'fs';
import axios, {AxiosRequestConfig} from "axios";
import Files from "./Files";
import {classToPlain} from "class-transformer";

export default class FileUploader {
    private readonly host;
    private readonly token = process.env.SOURCE_TOKEN;
    private readonly temporaryDirectory = './tmp'

    constructor(hostUrl: string) {
        this.host = hostUrl
    }

    /**
     * Starts an upload of all files by creating references for them,
     * they will have an status `pending` and each individual file has to be uploaded.
     * @param files
     * @param draftId
     */
    async startFileUploading(files: Files, draftId: string): Promise<void> {
        const axiosConfig: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
        }

        const startFilesUpload = `${this.host}/api/records/${draftId}/draft/files`;

        let fileNames = [];
        files.getEntries().forEach(file => fileNames.push({"key": file.key}))

        await axios.post(startFilesUpload, classToPlain(fileNames), axiosConfig);
    }

    /**
     * Uploads files to the draft record
     * @param fileName
     * @param draftId
     */
    async uploadSingleFile(fileName: string, draftId: string): Promise<void> {
        const binary = fs.readFileSync(`${this.temporaryDirectory}/${fileName}`);

        const axiosConfig: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${this.token}`,
                'content-type': 'application/octet-stream'
            }
        }

        return await axios.put(`${this.host}/api/records/${draftId}/draft/files/${fileName}/content`, binary, axiosConfig);
    }

    /**
     * Confirms upload of file
     * @param fileName
     * @param draftId
     */
    async confirmUpload(fileName: string, draftId: string): Promise<void> {

        const axiosConfig: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${this.token}`,
            }
        }
        return await axios.post(`${this.host}/api/records/${draftId}/draft/files/${fileName}/commit`, axiosConfig);
    }


    /**
     * Confirms upload of file
     * @param fileName
     * @param draftId
     */
    async checkStatus(fileName: string, draftId: string): Promise<string> {

        const axiosConfig: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${this.token}`,
            }
        }
        return await axios.get(`${this.host}/api/records/${draftId}/draft/files/${fileName}`, axiosConfig)
            .then(response => response.data['status']);
    }

}