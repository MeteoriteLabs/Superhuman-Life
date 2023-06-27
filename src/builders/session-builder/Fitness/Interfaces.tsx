interface ClientPackages {
    accepted_date: Date | null;
    effective_date: Date | null;
    id: string;
    __typename: string;
    users_permissions_user: {
        id: string;
        First_Name: string;
        Last_Name: string;
        username: string;
        __typename: string;
    };
}

interface FitnessPackage {
    End_date: Date;
    Start_date: Date;
    Status: boolean;
    duration: number;
    id: string;
    mode: string;
    packagename: string;
    __typename: string;
}

interface Sessions {
    id: string;
    session_date: string;
    type: string;
    __typename: string;
}

export interface Tag {
    id: string;
    tag_name: string | null;
    __typename: string;
    client_packages: ClientPackages[];
    fitnesspackage: FitnessPackage;
    sessions: Sessions[];
}

export interface TableContent {
    client: number | null;
    duration: number;
    end: string;
    id: string;
    packageName: string;
    programName: string;
    programStatus: string;
    renewal: string;
    start: string;
    tagId: string;
}
