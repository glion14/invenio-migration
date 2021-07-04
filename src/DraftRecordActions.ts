import fs from 'fs';
import axios, {AxiosRequestConfig} from "axios";
import RecordDraft from "./RecordDraft";
import {classToPlain, plainToClass} from "class-transformer";
import Hit from "./Hit";
import {ApiGateway} from "./ApiGateway";

export class DraftRecordActions extends ApiGateway {

    async pushInitialDraftRecord(recordDraft: RecordDraft): Promise<string> {
        const axiosPostConfig: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${this.targetToken}`,
                'Content-Type': 'application/json'
            }
        }

        return await axios.post(this.targetHost + '/api/records', classToPlain(recordDraft), axiosPostConfig)
            .then(response => plainToClass(Hit, response.data))
            .then(record => record.getId())
    }




}