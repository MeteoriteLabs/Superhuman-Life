import { Gear, WindowFullscreen } from 'react-bootstrap-icons';
import clsx from 'clsx';
import style from './tabs.module.css';

function CustomTabs({
  activeTab,
  setActiveTab
}: {
  activeTab: 'website' | 'theme' | 'settings';
  setActiveTab: (arg: 'website' | 'theme' | 'settings') => void;
}): JSX.Element {
  return (
    <div>
      <div className={style.topTabs}>
        <div onClick={() => setActiveTab('website')} className={style.tabsCont}>
          <WindowFullscreen fontSize={20} className="mb-2" />
          <p className={style.hText}>Website</p>
        </div>
        <div onClick={() => setActiveTab('theme')} className={style.tabsCont}>
          <img src="/assets/colour 1.png" width={20} className="mb-2" />
          <p className={style.hText}>Theme</p>
        </div>
        <div onClick={() => setActiveTab('settings')} className={style.tabsCont}>
          <Gear fontSize={20} className="mb-2" />
          <p className={style.hText}>Settings</p>
        </div>
        <div
          className={clsx(
            style.borderHeilight,
            activeTab === 'website'
              ? style.websitePos
              : activeTab === 'theme'
              ? style.themePos
              : style.settingsPos
          )}></div>
      </div>
    </div>
  );
}

export default CustomTabs;
