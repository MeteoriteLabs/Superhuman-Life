import { useEffect, useState } from 'react';
import { Gear, WindowFullscreen } from 'react-bootstrap-icons';
import clsx from 'clsx';

import WebsiteNav from './websiteNav';
import ThemeSettings from './themeSettings';
import GeneralSettings from './generalSettings';

import style from './tabs.module.css';
function CustomTabs({
    activeTab,
    setActiveTab
}: {
    activeTab: 'website' | 'theme' | 'settings';
    setActiveTab: (arg: 'website' | 'theme' | 'settings') => void;
}): JSX.Element {
    const [renderActiveTab, setRenderActiveTab] = useState<JSX.Element>(<WebsiteNav />);
    useEffect(() => {
        const renderActiveTab = (activeTab: string): JSX.Element => {
            switch (activeTab) {
                case 'website':
                    return <WebsiteNav />;
                case 'theme':
                    return <ThemeSettings />;
                case 'settings':
                    return <GeneralSettings />;
                default:
                    return <WebsiteNav />;
            }
        };
        setRenderActiveTab(renderActiveTab(activeTab));
    }, [activeTab]);
    return (
        <div>
            <div className={style.top_tabs}>
                <div onClick={() => setActiveTab('website')} className={style.tabs_cont}>
                    <WindowFullscreen fontSize={15} className="mb-2" />
                    <p className={style.h_text}>Website</p>
                </div>
                <div onClick={() => setActiveTab('theme')} className={style.tabs_cont}>
                    <img src="/assets/colour 1.png" width={15} className="mb-2" />
                    <p className={style.h_text}>Theme</p>
                </div>
                <div onClick={() => setActiveTab('settings')} className={style.tabs_cont}>
                    <Gear fontSize={15} className="mb-2" />
                    <p className={style.h_text}>Settings</p>
                </div>
                <div
                    className={clsx(
                        style.border_highlight,
                        activeTab === 'website'
                            ? style.website_pos
                            : activeTab === 'theme'
                            ? style.theme_pos
                            : style.settings_pos
                    )}
                ></div>
            </div>
            {renderActiveTab}
        </div>
    );
}

export default CustomTabs;
