import { useContext } from 'react';
import styles from '../../../style.module.css';
import { ChangeMakerWebsiteContext } from 'context/changemakerWebsite-context';
import { WindowFullscreen } from 'react-bootstrap-icons';
import returnRoute from 'lib/returnRoutes';

function Home(): JSX.Element {
    const { setChangemakerWebsiteState, changemakerWebsiteState } =
        useContext(ChangeMakerWebsiteContext);

    return (
        <div>
            <div
                className={styles.section_title_cont}
                onClick={(e) => {
                    e.stopPropagation();
                    setChangemakerWebsiteState({
                        ...changemakerWebsiteState,
                        section: 'Hero',
                        currentSelectedRoute: `${returnRoute('Home')}/#hero`
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
                        section: 'Features',
                        currentSelectedRoute: `${returnRoute('Home')}/#features`
                    });
                }}
            >
                <WindowFullscreen /> <span className={styles.section_title}>Features</span>
            </div>
            <div
                className={styles.section_title_cont}
                onClick={(e) => {
                    e.stopPropagation();
                    setChangemakerWebsiteState({
                        ...changemakerWebsiteState,
                        section: 'Cta',
                        currentSelectedRoute: `${returnRoute('Home')}/#cta`
                    });
                }}
            >
                <WindowFullscreen />
                <span className={styles.section_title}> Cta </span>
            </div>

            <div
                className={styles.section_title_cont}
                onClick={(e) => {
                    e.stopPropagation();
                    setChangemakerWebsiteState({
                        ...changemakerWebsiteState,
                        section: 'Pricing',
                        currentSelectedRoute: `${returnRoute('Home')}/#pricing`
                    });
                }}
            >
                <WindowFullscreen />
                <span className={styles.section_title}> Pricing</span>
            </div>
            <div
                className={styles.section_title_cont}
                onClick={(e) => {
                    e.stopPropagation();
                    setChangemakerWebsiteState({
                        ...changemakerWebsiteState,
                        section: 'Testimonials',
                        currentSelectedRoute: `${returnRoute('Home')}/#testimonials`
                    });
                }}
            >
                <WindowFullscreen /> <span className={styles.section_title}> Testimonials</span>
            </div>
        </div>
    );
}

export default Home;
