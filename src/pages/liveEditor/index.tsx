import LiveEditorSideNav from './components/liveEditorSideNav';
import style from './style.module.css';
import TopNav from './components/liveEditorSideNav/topNav';
import SelectedTemplate from './components/selectedTemplate';
import LiveEditorRightNav from './components/liveEditorRightNav.tsx';

function LiveEditor(): JSX.Element {
    return (
        <div className={style.liveEditor}>
            <TopNav />
            <LiveEditorSideNav />
            <SelectedTemplate />
            <LiveEditorRightNav />
        </div>
    );
}

export default LiveEditor;
