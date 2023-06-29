import { useContext } from 'react';
import styles from './style.module.css';
import { ChangeMakerWebsiteContext } from '../../../../context/changemakerWebsite-context';
import { WindowFullscreen } from 'react-bootstrap-icons';

function Home(): JSX.Element {
    const { setChangemakerWebsiteState, changemakerWebsiteState } =
        useContext(ChangeMakerWebsiteContext);
    return (
        <div className="mt-2">
            <div
                className={styles.sectionTitleCont}
                onClick={() => {
                    setChangemakerWebsiteState({
                        ...changemakerWebsiteState,
                        section: 'Home: Hero'
                    });
                }}
            >
                <WindowFullscreen /> <span className={styles.sectionTitle}>Hero</span>
            </div>
            <div
                className={styles.sectionTitleCont}
                onClick={() => {
                    setChangemakerWebsiteState({
                        ...changemakerWebsiteState,
                        section: 'Home: Features'
                    });
                }}
            >
                <WindowFullscreen /> <span className={styles.sectionTitle}>Features</span>
            </div>
            <div
                className={styles.sectionTitleCont}
                onClick={() => {
                    setChangemakerWebsiteState({
                        ...changemakerWebsiteState,
                        section: 'Home: Cta'
                    });
                }}
            >
                <WindowFullscreen />
                <span className={styles.sectionTitle}> Cta </span>
            </div>

            <div
                className={styles.sectionTitleCont}
                onClick={() => {
                    setChangemakerWebsiteState({
                        ...changemakerWebsiteState,
                        section: 'Home: Pricing'
                    });
                }}
            >
                <WindowFullscreen />
                <span className={styles.sectionTitle}> Pricing</span>
            </div>
            <div
                className={styles.sectionTitleCont}
                onClick={() => {
                    setChangemakerWebsiteState({
                        ...changemakerWebsiteState,
                        section: 'Home: Testimonials'
                    });
                }}
            >
                <WindowFullscreen /> <span className={styles.sectionTitle}> Testimonials</span>
            </div>
        </div>
    );
}

export default Home;
