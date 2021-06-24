interface FileEntry {
    key: string;
    created: string;
    updated: string;
    checksum: string;
    mimetype: string;
    size: number;
    metadata: any;
    fileId: string;
    versionId: string;
    bucketId: string;
    storageClass: string;
    links: any;
}

export default class Files {
    private enabled: boolean;
    private links: any;
    private entries: FileEntry[];
    private defaultPreview: string;
    private order: any[];

    getEntries(): FileEntry[] {
        return this.entries;
    }
}