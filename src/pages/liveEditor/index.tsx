import { useState } from 'react';
import LiveEditorSideNav from './components/liveEditorSideNav';
import style from './style.module.css';
import TopNav from './components/liveEditorSideNav/topNav';
import SelectedTemplate from './components/selectedTemplate';
import LiveEditorForms from './components/liveEditorForms';

function LiveEditor(): JSX.Element {
    const [collapse, setCollapse] = useState<boolean>(false);
    return (
        <div className={style.liveEditor}>
            <TopNav />
            <LiveEditorSideNav collapse={collapse} setCollapse={setCollapse} />
            <SelectedTemplate />
            <LiveEditorForms />
        </div>
    );
}

export default LiveEditor;
