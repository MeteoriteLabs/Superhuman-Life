import { useContext } from 'react';
import style from './style.module.css';
import { ChangeMakerWebsiteContext } from 'context/changemakerWebsite-context';

function GeneralSettings(): JSX.Element {
    const { changemakerWebsiteState, setChangemakerWebsiteState } =
        useContext(ChangeMakerWebsiteContext);
    return (
        <div className={style.generalSettings}>
            <p
                className={style.settingOptions}
                onClick={() =>
                    setChangemakerWebsiteState({
                        ...changemakerWebsiteState,
                        selectedSetting: 'select_offerings'
                    })
                }
            >
                Select Offerings
            </p>
        </div>
    );
}

export default GeneralSettings;
