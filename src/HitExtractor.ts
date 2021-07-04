import Hit from "./Hit";
import Files from "./Files";
import FileDownloader from "./FileDownloader";
import RecordDraft from "./RecordDraft";
import FileUploader from "./FileUploader";
import {DraftRecordActions} from "./DraftRecordActions";
import FileModel from "./FileModel";

export default class HitExtractor {
    private readonly fileDownloader: FileDownloader;
    private readonly fileUploader: FileUploader;
    private readonly draftActions: DraftRecordActions;

    constructor() {
        this.fileDownloader = new FileDownloader();
        this.fileUploader = new FileUploader();
        this.draftActions = new DraftRecordActions();
    }

    async process(hit: Hit, hitId: string) {
        // check files and get entries to objects
        const fileLink = hit.getFileLink();
        const files: Files = await this.fileDownloader.retrieveFileEntries(fileLink);

        console.info(`Fetched files metadata and preparing to download them`)
        // download files one by one to local storage
        files.getEntries()
            .forEach(file => this.fileDownloader.downloadSingleFile(file.key, hitId))

        console.info("Downloaded all files")
        // start creating a draft with Hit object
        const recordDraft = new RecordDraft(hit)

        const pushedDraftId = await this.draftActions.pushInitialDraftRecord(recordDraft);
        console.info(`Created new draft record in target repository with id ${pushedDraftId}`)
        await this.fileUploader.startFileUploading(files, pushedDraftId);

        for (const file of files.getEntries()) {
            console.info(`Uploading file ${file.key}`);
            try {
                await this.fileUploader.uploadSingleFile(file.key, pushedDraftId);
                const uploadConfirmed = await this.fileUploader.confirmUpload(file.key, pushedDraftId)
                const checksumEquals = this.validateChecksum(file.checksum, uploadConfirmed.checksum);

                if(!checksumEquals){
                    console.error(`Checksums are not equal for files ${file.key} and ${uploadConfirmed.key} on record draft ${pushedDraftId}`)
                    break;
                }
            } catch (e) {
                console.error(e);
            }
        }

        //after all files are uploaded we publish the record
    }

    validateChecksum(originalCheckSum: string, uploadedCheckSum: string ) {
        return originalCheckSum === uploadedCheckSum
    }
}