import { ChangeMakerWebsiteContext } from 'context/changemakerWebsite-context';
import { useContext } from 'react';
import { SelectOfferings } from './settingsList';

const index = (): JSX.Element => {
    const settingsList = {
        select_offerings: <SelectOfferings />
    };
    const { changemakerWebsiteState } = useContext(ChangeMakerWebsiteContext);
    return <div>{settingsList[changemakerWebsiteState.selectedSetting || '']}</div>;
};

export default index;
