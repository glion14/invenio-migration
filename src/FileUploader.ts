import fs from 'fs';
import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import Files from "./Files";
import {classToPlain, plainToClass} from "class-transformer";
import FileModel from "./FileModel";
import {ApiGateway} from "./ApiGateway";

export default class FileUploader extends ApiGateway {
    private readonly temporaryDirectory = './tmp'
    private snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

    /**
     * Starts an upload of all files by creating references for them,
     * they will have an status `pending` and each individual file has to be uploaded.
     * @param files
     * @param draftId
     */
    async startFileUploading(files: Files, draftId: string): Promise<void> {
        const axiosConfig: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${this.targetToken}`,
                'Content-Type': 'application/json'
            }
        }

        const startFilesUpload = `${this.targetHost}/api/records/${draftId}/draft/files`;

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
                Authorization: `Bearer ${this.targetToken}`,
                'content-type': 'application/octet-stream'
            }
        }

        return await axios.put(`${this.targetHost}/api/records/${draftId}/draft/files/${fileName}/content`, binary, axiosConfig);
    }

    /**
     * Confirms upload of file on while loop. As we often get 403 when the object is not fully uploaded.
     * @param fileName
     * @param draftId
     */
    async confirmUpload(fileName: string, draftId: string): Promise<FileModel> {

        while (true) {
            await this.snooze(1000);
            const response = await this.executeUploadCommit(fileName, draftId).catch(error => {
                console.debug(error)
                return null;
            })
            if(response != null && response.status === 200) {
                return plainToClass(FileModel, response.data);
            }
        }
    }


    private async executeUploadCommit(fileName: string, draftId: string): Promise<AxiosResponse> {

        const axiosConfig: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${this.targetToken}`,
            }
        }
        return await axios.post(`${this.targetHost}/api/records/${draftId}/draft/files/${fileName}/commit`,{}, axiosConfig);
    }


    /**
     * Confirms upload of file
     * @param fileName
     * @param draftId
     */
    async checkStatus(fileName: string, draftId: string): Promise<string> {

        const axiosConfig: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${this.targetToken}`,
            }
        }
        return await axios.get(`${this.targetHost}/api/records/${draftId}/draft/files/${fileName}`, axiosConfig)
            .then(response => response.data['status']);
    }

}