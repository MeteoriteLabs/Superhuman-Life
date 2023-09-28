import Forms from 'tabs/forms';
import Settings from 'tabs/settings';
import Theme from 'tabs/theme';
import style from './liveEditorRightNav.module.css';
import { useContext } from 'react';
import { ChangeMakerWebsiteContext } from 'context/changemakerWebsite-context';

export default function LiveEditorRightNav(): JSX.Element {
    const { changemakerWebsiteState } = useContext(ChangeMakerWebsiteContext);
    return (
        <aside className={style.side_nav_cont}>
            {changemakerWebsiteState.tabs === 'website' ? (
                <Forms />
            ) : changemakerWebsiteState.tabs === 'settings' ? (
                <Settings />
            ) : (
                <Theme />
            )}
        </aside>
    );
}
