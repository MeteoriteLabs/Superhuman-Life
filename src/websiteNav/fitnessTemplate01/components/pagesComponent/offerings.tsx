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
                        section: 'Group Offerings'
                    });
                }}
            >
                <WindowFullscreen /> <span className={styles.section_title}>Group Offerings</span>
            </div>
            <div
                className={styles.section_title_cont}
                onClick={() => {
                    setChangemakerWebsiteState({
                        ...changemakerWebsiteState,
                        section: 'Cohort'
                    });
                }}
            >
                <WindowFullscreen />
                <span className={styles.section_title}> Cohort </span>
            </div>

            <div
                className={styles.section_title_cont}
                onClick={() => {
                    setChangemakerWebsiteState({
                        ...changemakerWebsiteState,
                        section: 'One to One'
                    });
                }}
            >
                <WindowFullscreen />
                <span className={styles.section_title}> One to One</span>
            </div>
            <div
                className={styles.section_title_cont}
                onClick={() => {
                    setChangemakerWebsiteState({
                        ...changemakerWebsiteState,
                        section: 'Live Stream'
                    });
                }}
            >
                <WindowFullscreen /> <span className={styles.section_title}> Live Stream</span>
            </div>
            <div
                className={styles.section_title_cont}
                onClick={() => {
                    setChangemakerWebsiteState({
                        ...changemakerWebsiteState,
                        section: 'Custom'
                    });
                }}
            >
                <WindowFullscreen /> <span className={styles.section_title}>Custom</span>
            </div>
        </div>
    );
}

export default Home;
