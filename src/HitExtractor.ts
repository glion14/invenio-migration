import {plainToClass} from "class-transformer";
import Hit from "./Hit";
import Files from "./Files";

export default class HitExtractor {

    async process(hit: Hit, hitId: string) {
        // check files and get entries to objects
        const fileLink = hit.getFileLink();
        const files: Files = await this.retrieveFileEntries(fileLink, hitId);
        console.log(files);
        // download files one by one to local storage

        // start creating a draft with Hit object

        // continue with uploading files to the draft from local storage

        // verify files metadata

    }

    async retrieveFileEntries(fileLink: string, hitId): Promise<Files> {
        const token = process.env.RDM_TOKEN;
        const requestInit: RequestInit = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        return await fetch(`${fileLink}`, requestInit)
            .then(file => plainToClass(Files, file))
    }
}