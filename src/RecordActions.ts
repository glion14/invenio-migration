import axios, {AxiosRequestConfig} from "axios";
import RecordDraft from "./RecordDraft";
import {classToPlain, plainToClass} from "class-transformer";
import Record from "./Record";
import {ApiGateway} from "./ApiGateway";

export class RecordActions extends ApiGateway {

    /**
     * Creates a initial draft of a record in target repository
     * @param recordDraft
     */
    async pushInitialDraftRecord(recordDraft: RecordDraft): Promise<string> {
        const axiosPostConfig: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${this.targetToken}`,
                'Content-Type': 'application/json'
            }
        }

        return await axios.post(this.targetHost + '/api/records', classToPlain(recordDraft), axiosPostConfig)
            .then(response => plainToClass(Record, response.data))
            .then(record => record.getId())
    }

    /**
     * Published finalized draft record
     * @param draftId
     */
    async publishDraftRecord(draftId: string): Promise<Record> {
        const axiosPostConfig: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${this.targetToken}`,
                'Content-Type': 'application/json'
            }
        }

        return await axios.post(this.targetHost + `/api/records/${draftId}/draft/actions/publish`, {}, axiosPostConfig)
            .then(response => plainToClass(Record, response.data))
    }

    /**
     * Fetches record from the source repository which we want to migrate
     * @param recordId
     */
    async fetchSourceRecord(recordId: string): Promise<Record> {
        return await fetch(this.sourceHost + `/api/records/${recordId}`)
            .then(response => response.json())
            .then(hit => plainToClass(Record, hit))

    }
}