import 'reflect-metadata';
import FilesHandler from "./FilesHandler";
import {RecordActions} from "./RecordActions";
import RecordDraft from "./RecordDraft";

"use strict";
require('dotenv').config()

global.fetch = require("node-fetch");

const baseUrl = "https://inveniordm.web.cern.ch"
const filesHandler = new FilesHandler();
const recordActions = new RecordActions();

export async function init () {
    const migrationIds = process.env.MIGRATION_IDS.split(",");

    for (const hitId of migrationIds) {

        console.info(`Starting migration for record ${hitId}`)
        const sourceRecord = await recordActions.fetchSourceRecord(hitId)

        //creates initial draft record
        const recordDraft = new RecordDraft(sourceRecord)
        const draftRecordId = await recordActions.pushInitialDraftRecord(recordDraft)
        console.info(`Created draft record in target repository with id ${draftRecordId}`)

        let uploadFailed = false;
        if(sourceRecord.getFiles().enabled){
            await filesHandler.handleFiles(sourceRecord, draftRecordId).catch(error => {
                console.error(`Failed to upload all files, aborting migration and not publishing record. Error: ${error}`);
                uploadFailed = true;
            })
        } else {
            console.info('Files are disabled, skipping them')
        }


        if(!uploadFailed){
            const publishedRecord = await recordActions.publishDraftRecord(draftRecordId);
        }

        //validation of source record vs target record
    }
}







init()