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
                onClick={(e) => {
                    e.stopPropagation();
                    setChangemakerWebsiteState({
                        ...changemakerWebsiteState,
                        section: 'Hero',
                        currentSelectedRoute: `${returnRoute('Offerings')}/#hero`
                    });
                }}
            >
                <WindowFullscreen /> <span className={styles.section_title}>Hero</span>
            </div>
            <div
                className={styles.section_title_cont}
                onClick={(e) => {
                    e.stopPropagation();
                    setChangemakerWebsiteState({
                        ...changemakerWebsiteState,
                        section: 'Group Offerings',
                        currentSelectedRoute: `${returnRoute('Offerings')}/#group-offerings`
                    });
                }}
            >
                <WindowFullscreen /> <span className={styles.section_title}>Group Offerings</span>
            </div>
            <div
                className={styles.section_title_cont}
                onClick={(e) => {
                    e.stopPropagation();
                    setChangemakerWebsiteState({
                        ...changemakerWebsiteState,
                        section: 'Cohort',
                        currentSelectedRoute: `${returnRoute('Offerings')}/#cohort`
                    });
                }}
            >
                <WindowFullscreen />
                <span className={styles.section_title}> Cohort </span>
            </div>

            <div
                className={styles.section_title_cont}
                onClick={(e) => {
                    e.stopPropagation();
                    setChangemakerWebsiteState({
                        ...changemakerWebsiteState,
                        section: 'One to One',
                        currentSelectedRoute: `${returnRoute('Offerings')}/#one-to-one`
                    });
                }}
            >
                <WindowFullscreen />
                <span className={styles.section_title}> One to One</span>
            </div>
            <div
                className={styles.section_title_cont}
                onClick={(e) => {
                    e.stopPropagation();
                    setChangemakerWebsiteState({
                        ...changemakerWebsiteState,
                        section: 'Live Stream',
                        currentSelectedRoute: `${returnRoute('Offerings')}/#live-stream`
                    });
                }}
            >
                <WindowFullscreen /> <span className={styles.section_title}> Live Stream</span>
            </div>
            <div
                className={styles.section_title_cont}
                onClick={(e) => {
                    e.stopPropagation();
                    setChangemakerWebsiteState({
                        ...changemakerWebsiteState,
                        section: 'Custom',
                        currentSelectedRoute: `${returnRoute('Offerings')}/#custom`
                    });
                }}
            >
                <WindowFullscreen /> <span className={styles.section_title}>Custom</span>
            </div>
        </div>
    );
}

export default Home;
