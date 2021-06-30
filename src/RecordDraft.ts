import Hit, {Access, HitFiles, Metadata} from "./Hit";

export default class RecordDraft {
    private access: { record: string; files: string; embargo: {} };
    private files: { defaultPreview: string; enabled: string; order: any[] };
    private metadata: Metadata;

    constructor(record:Hit) {

        this.access = RecordDraft.transformAccess(record.getAccess());
        this.files = RecordDraft.transformFiles(record.getFiles())
        this.metadata = record.getMetadata()

        return this;
    }


    private static transformAccess(hitAccess:Access) {

        const record = hitAccess.record;
        const files = hitAccess.files;
        let embargo = null

        if (record == 'restricted' || files == 'restricted'){
            embargo = hitAccess.embargo
        }

        return {
            record: record,
            files: files,
            embargo: embargo
        }
    }

    private static transformFiles(files:HitFiles) {

        let enabled = files.enabled;
        let defaultPreview = ""; //filename to be displayed as default
        let order =  files.order;

        return {
            enabled:enabled,
            defaultPreview:defaultPreview,
            order:order
        }
    }
}

export type DraftEmbargo = {
    reason: string,
    active: boolean
    until: string //iso datetime
}

export type DraftAccess = {
    record: string
    files: string,
    embargo: DraftEmbargo,
}

export type DraftFiles = {
    enabled: boolean,
    defaultPreview: string,
    order: any[]
}