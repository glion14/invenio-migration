
export default class Hit {
    private pid: any;
    private access: Access;
    private created: string;
    private files: HitFiles;
    private isPublished: boolean;
    private id: string;
    private versions: Versions;
    private updated: string;
    private links: Links;
    private parent: Parent;
    private metadata: Metadata;
    private revisionId: number;

    public getFileLink(): string {
        return this.links.files;
    }

    public getAccess(): Access {
        return this.access
    }

    public  getMetadata(): Metadata {
        return this.metadata
    }

    public getFiles(): HitFiles {
        return this.files;
    }

}

export type Versions = {
    isLatest: boolean,
    index: number
}

export type HitFiles = {
    enabled: string,
    order: any[]
}


export type Embargo = {
    reason: string,
    active: boolean
}

export type Access = {
    status: string,
    files: string,
    embargo: Embargo,
    record: string
}

export type Links = {
    self: string,
    selfHtml: string,
    selfDoi: string,
    files: string,
    latest: string,
    latestHtml: string,
    draft: string,
    versions: string,
    accessLinks: string,
    reserveDoi: string
}

export type Parent = {
    id: string
}

export type Metadata = {
    publisher: string,
    description: string,
    additionalDescription: string,
    rights: any[],
    creators: any[],
    publicationDate: string,
    dates: any[],
    title: string,
    additionalTitles: any[],
    resourceType: any,
    subjects: any[], //experimental
    contributors: any[],
    languages: any[],
    relatedIdentifiers: any[],
    sizes: any[],
    formats: any[],
    version: string,
    // locations:
    fundingReferences: any[], //experimental
    // owners:
}