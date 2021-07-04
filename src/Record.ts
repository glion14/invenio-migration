export default class Record {
    private id: string;
    private pid: Pid;
    private parent: Parent;
    private pids: Pids;
    private metadata: Metadata;
    private ext: any[];
    private provenance: Provenance;
    private access: Access;
    private files: HitFiles;

    private isPublished: boolean;
    private versions: Versions;
    private links: Links;
    private revisionId: number;
    private updated: string;
    private created: string;

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

    public  getId(): string {
        return this.id;
    }
}

export type Versions = {
    isLatest: boolean,
    index: number
}

export type HitFiles = {
    enabled: string,
    order: string[],
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

export type Provenance = {
    createdBy: {user: number},
    onBehalfOf: {user: number},
}

export type Parent = {
    id: string
}

export type Pid = {
    pk: number,
    status: string,
}

export type Pids = {
    doi: ExternalPid,
    'concept-doi': ExternalPid
}

export type ExternalPid = {
    identifier: string,
    provider: string,
    client: string
}

export type Creator = {
    personOrOrg: PersonOrOrg,
    affiliations: Affiliation[],
    role: string
}

export type Affiliation = {
    identifiers: Identifier[],
    name: string
}

export type PersonOrOrg = {
    name: string,
    type: string, //personal or organisational
    given_name: string,
    family_name: string,
    identifiers: Identifier[]
}

export type Identifier = {
    identifier: string,
    scheme: string
}

export type ResourceType = {
    id: string
}

export type AdditionalTitles = {
    title: string,
    type: string,
    lang: string
}

export type AdditionalDescription = {
    description: string,
    type: string,
    lang: string
}

export type Subject = {
    subject: string,
    identifier: string,
    scheme: string
}

export type Date = {
    date: string,
    type: string,
    description: string,
}

export type RelatedIdentifier = {
    identifier: string,
    scheme: string,
    relation: string,
    resourceType: ResourceType
}

export type Right = {
    description: string,
    id: string,
    link: string,
    title: string
}

export type LocationFeature = {
    geometry: Geometry,
    identifiers: {geonames: string, tgn: string},
    place: string,
    description: string,
}

export type Geometry = {
    type: string,
    coordinates: number[],

}

export type FundingReference = {
    funder: Funder,
    award: Award
}

export type Award = {
    title: string,
    number: string
    identifier: string,
    scheme: string,
}

export type Funder = {
    name: string,
    identifier: string,
    scheme: string
}

export type Metadata = {
    resourceType: ResourceType,
    creators: Creator[],
    title: string,
    additionalTitles: AdditionalTitles[],
    description: string,
    additionalDescription: AdditionalDescription[],
    publisher: string,
    publicationDate: string,
    subjects: Subject[], //experimental
    contributors: Creator[],
    dates: Date[],
    languages: string[],
    identifiers: Identifier[]
    relatedIdentifiers: RelatedIdentifier[],
    sizes: string[],
    formats: string[],
    version: string,
    rights: Right[],
    locations: {features: LocationFeature[]}
    fundingReferences: FundingReference[], //experimental
}