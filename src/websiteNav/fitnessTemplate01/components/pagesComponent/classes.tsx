import { useContext } from 'react';
import styles from '../../../style.module.css';
import { ChangeMakerWebsiteContext } from 'context/changemakerWebsite-context';
import { WindowFullscreen } from 'react-bootstrap-icons';

function Home(): JSX.Element {
    const { setChangemakerWebsiteState, changemakerWebsiteState } =
        useContext(ChangeMakerWebsiteContext);
    return (
        <div className="mt-2">
            <div
                className={styles.section_title_cont}
                onClick={() => {
                    setChangemakerWebsiteState({
                        ...changemakerWebsiteState,
                        section: 'Hero'
                    });
                }}
            >
                <WindowFullscreen /> <span className={styles.section_title}>Hero</span>
            </div>
            <div
                className={styles.section_title_cont}
                onClick={() => {
                    setChangemakerWebsiteState({
                        ...changemakerWebsiteState,
                        section: 'Features'
                    });
                }}
            >
                <WindowFullscreen /> <span className={styles.section_title}>Features</span>
            </div>
            <div
                className={styles.section_title_cont}
                onClick={() => {
                    setChangemakerWebsiteState({
                        ...changemakerWebsiteState,
                        section: 'Scheduler'
                    });
                }}
            >
                <WindowFullscreen />
                <span className={styles.section_title}> Scheduler</span>
            </div>
        </div>
    );
}

export default Home;
