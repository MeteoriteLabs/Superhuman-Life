import { useContext } from 'react';
import styles from '../../../style.module.css';
import { ChangeMakerWebsiteContext } from 'context/changemakerWebsite-context';
import { WindowFullscreen } from 'react-bootstrap-icons';
import returnRoute from 'lib/returnRoutes';

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
                        section: 'Hero',
                        currentSelectedRoute: `${returnRoute('Classes')}/#hero`
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
                        section: 'Features',
                        currentSelectedRoute: `${returnRoute('Classes')}/#features`
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
                        section: 'Scheduler',
                        currentSelectedRoute: `${returnRoute('Classes')}/#scheduler`
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
