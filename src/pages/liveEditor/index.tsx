import LiveEditorSideNav from './components/liveEditorSideNav';
import style from './style.module.css';
import TopNav from './components/liveEditorSideNav/topNav';
import SelectedTemplate from './components/selectedTemplate';
import LiveEditorForms from './components/liveEditorForms';

function LiveEditor(): JSX.Element {
   
    return (
        <div className={style.liveEditor}>
            <TopNav />
            <LiveEditorSideNav/>
            <SelectedTemplate />
            <LiveEditorForms />
        </div>
    );
}

export default LiveEditor;
