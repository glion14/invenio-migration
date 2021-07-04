import FileModel from "./FileModel";

export default class Files {
    private enabled: boolean;
    private links: any;
    private entries: FileModel[];
    private defaultPreview: string;
    private order: any[];

    getEntries(): FileModel[] {
        return this.entries;
    }
}