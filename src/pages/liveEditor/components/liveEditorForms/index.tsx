import { useContext } from 'react';
import Forms from '../../../../forms';
import style from './liveEditorForms.module.css';
import { ChangeMakerWebsiteContext } from '../../../../context/changemakerWebsite-context';

export default function LiveEditorSideNav(): JSX.Element {
    const { changemakerWebsiteState } = useContext(ChangeMakerWebsiteContext);
    return (
        <aside className={style.sideNavCont}>
            {/* <Nav className="flex-column"></Nav> */}
            <Forms
                section={
                    changemakerWebsiteState.section ? changemakerWebsiteState.section : 'Home: Hero'
                }
            />
        </aside>
    );
}
