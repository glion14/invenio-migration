import Record from "./Record";
import Files from "./Files";
import FileDownloader from "./FileDownloader";
import FileUploader from "./FileUploader";
import FileModel from "./FileModel";

export default class FilesHandler {
    private readonly fileDownloader: FileDownloader;
    private readonly fileUploader: FileUploader;

    constructor() {
        this.fileDownloader = new FileDownloader();
        this.fileUploader = new FileUploader();
    }

    /**
     * Handles files with cleanup afterwards
     * @param sourceRecord
     * @param draftRecordId
     */
    async handleFiles(sourceRecord: Record, draftRecordId: string) {

        return this.process(sourceRecord, draftRecordId).then(ignored => {
            console.debug("Cleaning up downloaded files")
            //cleanup
            this.fileDownloader.cleanUpDownloadedFiles();
        })
    }

    async process(sourceRecord: Record, draftRecordId: string): Promise<void> {
        // check files and get entries to objects
        const fileLink = sourceRecord.getFileLink();
        const files: Files = await this.fileDownloader.retrieveFileEntries(fileLink);


        if(files.getEntries().length == 0){
            console.debug("Files are allowed but none has been found.")
            return;
        }

        console.info(`Fetched files metadata and preparing to download them`)
        // download files one by one to local storage
        for (const file of files.getEntries()) {
            await this.fileDownloader.downloadSingleFile(file.key, sourceRecord.getId());
        }

        console.info("Downloaded all files")
        let confirmedPromises: Promise<FileModel>[] = [];
        await this.fileUploader.startFileUploading(files, draftRecordId);
        for (const file of files.getEntries()) {
            console.info(`Uploading file ${file.key}`);
            try {
                await this.fileUploader.uploadSingleFile(file.key, draftRecordId);
                const confirmPromise: Promise<FileModel> = this.fileUploader.confirmUpload(file.key, draftRecordId)
                confirmedPromises.push(confirmPromise);
                const uploadConfirmed = await confirmPromise;
                const checksumEquals = this.validateChecksum(file.checksum, uploadConfirmed.checksum);

                if(!checksumEquals){
                    console.error(`WARN: checksums are not equal with source for file ${file.key} on draft record ${draftRecordId}`)
                } else {
                    console.info(`Checksums are OK for file ${file.key}`)
                }
            } catch (e) {
                console.error(e);
            }
        }

        return await Promise.all(confirmedPromises)
            .then(() => {});
    }

    validateChecksum(originalCheckSum: string, uploadedCheckSum: string ) {
        return originalCheckSum === uploadedCheckSum
    }
}