import { useState } from 'react';
import LiveEditorSideNav from './components/liveEditorSideNav';
import style from './style.module.css';
import TopNav from './components/liveEditorSideNav/topNav';
import SelectedTemplate from './components/selectedTemplate';

function LiveEditor(): JSX.Element {
    const [collapse, setCollapse] = useState<boolean>(false);
    return (
        <div className={style.liveEditor}>
            <TopNav />
            <LiveEditorSideNav collapse={collapse} setCollapse={setCollapse} />
            <SelectedTemplate />
        </div>
    );
}

export default LiveEditor;
