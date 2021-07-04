import Record from "./Record";
import Files from "./Files";
import FileDownloader from "./FileDownloader";
import FileUploader from "./FileUploader";

export default class FilesHandler {
    private readonly fileDownloader: FileDownloader;
    private readonly fileUploader: FileUploader;

    constructor() {
        this.fileDownloader = new FileDownloader();
        this.fileUploader = new FileUploader();
    }

    async process(sourceRecord: Record, draftRecordId: string) {
        // check files and get entries to objects
        const fileLink = sourceRecord.getFileLink();
        const files: Files = await this.fileDownloader.retrieveFileEntries(fileLink);


        if(files.getEntries().length == 0){
            console.debug("Files are allowed but none has been found.")
            return;
        }

        console.info(`Fetched files metadata and preparing to download them`)
        // download files one by one to local storage
        files.getEntries()
            .forEach(file => this.fileDownloader.downloadSingleFile(file.key, sourceRecord.getId()))

        console.info("Downloaded all files")

        await this.fileUploader.startFileUploading(files, draftRecordId);
        for (const file of files.getEntries()) {
            console.info(`Uploading file ${file.key}`);
            try {
                await this.fileUploader.uploadSingleFile(file.key, draftRecordId);
                const uploadConfirmed = await this.fileUploader.confirmUpload(file.key, draftRecordId)
                const checksumEquals = this.validateChecksum(file.checksum, uploadConfirmed.checksum);

                if(!checksumEquals){
                    console.error(`Checksums are not equal for files ${file.key} and ${uploadConfirmed.key} on record draft ${draftRecordId}`)
                    break;
                } else {
                    console.info(`Source and Target checksums are OK for file ${file.key}`)
                }
            } catch (e) {
                console.error(e);
            }
        }
        //cleanup
        this.fileDownloader.cleanUpDownloadedFiles();
    }

    validateChecksum(originalCheckSum: string, uploadedCheckSum: string ) {
        return originalCheckSum === uploadedCheckSum
    }
}