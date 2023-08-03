import Forms from 'forms';
import style from './liveEditorForms.module.css';

export default function LiveEditorSideNav(): JSX.Element {
    return (
        <aside className={style.side_nav_cont}>
            <Forms />
        </aside>
    );
}
