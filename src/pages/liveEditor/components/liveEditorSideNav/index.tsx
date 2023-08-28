import { Nav } from 'react-bootstrap';
import { useState } from 'react';
import style from './liveEditorSideNav.module.css';
import CustomTabs from './tabs';

export default function LiveEditorSideNav(): JSX.Element {
    const [activeTab, setActiveTab] = useState<'website' | 'theme' | 'settings'>('website');

    return (
        <aside className={style.side_nav_cont}>
            <Nav className="flex-column"></Nav>
            <CustomTabs setActiveTab={setActiveTab} activeTab={activeTab} />
        </aside>
    );
}
