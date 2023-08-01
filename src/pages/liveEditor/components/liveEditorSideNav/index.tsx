import { Nav } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import style from './liveEditorSideNav.module.css';
import CustomTabs from './tabs';

export default function LiveEditorSideNav({
    collapse,
    setCollapse
}: {
    collapse: boolean;
    setCollapse: (arg: boolean) => void;
}): JSX.Element {
    const location = useLocation();
    const [selectedOption, setSelectedOption] = useState<string>(location.pathname.slice(1));
    const [activeTab, setActiveTab] = useState<'website' | 'theme' | 'settings'>('website');

    useEffect(() => {
        setSelectedOption(location.pathname.slice(1));
    }, [location]);

    return (
        <aside className={style.side_nav_cont}>
            <Nav className="flex-column"></Nav>
            <CustomTabs setActiveTab={setActiveTab} activeTab={activeTab} />
        </aside>
    );
}
