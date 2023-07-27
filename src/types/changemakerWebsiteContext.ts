import { Dispatch, SetStateAction } from 'react';

export type changeMakerWebsiteStateTs = {
    domain: string | null;
    subdomain: string | null;
    selectedTemplate: string | null;
    thumbnail: string | null;
    templateUrl: string | null;
    loading: boolean;
    section: string | null;
    page: string | null
};
export type changeMakerWebsiteTs = {
    changemakerWebsiteState: changeMakerWebsiteStateTs;
    setChangemakerWebsiteState: Dispatch<SetStateAction<changeMakerWebsiteStateTs>>;
};
