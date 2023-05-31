import { useState } from 'react';
import LiveEditorSideNav from '../../layout/liveEditorSideNav';
import style from './style.module.css';

function LiveEditor(): JSX.Element {
  const [collapse, setCollapse] = useState<boolean>(false);
  return (
    <div className={style.liveEditor}>
      <LiveEditorSideNav collapse={collapse} setCollapse={setCollapse} />
    </div>
  );
}

export default LiveEditor;
