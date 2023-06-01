import { useState } from 'react';
import LiveEditorSideNav from './components/liveEditorSideNav';
import style from './style.module.css';
import TopNav from './components/liveEditorSideNav/topNav';

function LiveEditor(): JSX.Element {
  const [collapse, setCollapse] = useState<boolean>(false);
  return (
    <div className={style.liveEditor}>
      <TopNav />
      <LiveEditorSideNav collapse={collapse} setCollapse={setCollapse} />
    </div>
  );
}

export default LiveEditor;
