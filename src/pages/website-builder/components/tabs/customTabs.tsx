import { Gear, WindowFullscreen } from 'react-bootstrap-icons';
import style from './tabs.module.css';

function CustomTabs({
  setActiveTab
}: {
  setActiveTab: (arg: 'website' | 'theme' | 'settings') => void;
}): JSX.Element {
  return (
    <div>
      <div className={style.topTabs}>
        <div onClick={() => setActiveTab('website')}>
          <WindowFullscreen fontSize={24} className="mb-2" />
          <p className="mb-0">Website</p>
        </div>
        <div onClick={() => setActiveTab('theme')}>
          <img src="/assets/colour 1.png" width={24} className="mb-2" />
          <p className="mb-0">Theme</p>
        </div>
        <div onClick={() => setActiveTab('settings')}>
          <Gear fontSize={24} className="mb-2" />
          <p className="mb-0">Settings</p>
        </div>
      </div>
    </div>
  );
}

export default CustomTabs;
