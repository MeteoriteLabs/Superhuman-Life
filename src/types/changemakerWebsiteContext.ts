import { Dispatch, SetStateAction } from 'react';

export type changeMakerWebsiteStateTs = {
    domain: string | null;
    subdomain: string | null;
    selectedTemplate: string | null;
    thumbnail: string | null;
    templateUrl: string | null;
    loading: boolean;
    section: string | null;
    currentSelectedRoute: string | null;
    iframeSize: 'mobile'| 'desktop',
    tabs: 'website' | 'theme' | 'settings';
    selectedSetting: string|null
};
export type changeMakerWebsiteTs = {
    changemakerWebsiteState: changeMakerWebsiteStateTs;
    setChangemakerWebsiteState: Dispatch<SetStateAction<changeMakerWebsiteStateTs>>;
};
