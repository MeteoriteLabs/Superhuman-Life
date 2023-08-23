import { useContext, useEffect } from 'react';
import styles from '../../../style.module.css';
import { ChangeMakerWebsiteContext } from 'context/changemakerWebsite-context';
import { WindowFullscreen } from 'react-bootstrap-icons';

function Home(): JSX.Element {
    const { setChangemakerWebsiteState, changemakerWebsiteState } =
        useContext(ChangeMakerWebsiteContext);

    useEffect(() => {
        console.log(changemakerWebsiteState.section);
    }, [changemakerWebsiteState.section]);
    return (
        <div>
            <div
                className={styles.section_title_cont}
                onClick={(e) => {
                    e.stopPropagation();
                    setChangemakerWebsiteState({
                        ...changemakerWebsiteState,
                        section: 'Hero'
                    });
                    console.log(changemakerWebsiteState, 1);
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
                        section: 'Features'
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
                        section: 'Cta'
                    });
                    console.log();
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
                        section: 'Pricing'
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
                        section: 'Testimonials'
                    });
                }}
            >
                <WindowFullscreen /> <span className={styles.section_title}> Testimonials</span>
            </div>
        </div>
    );
}

export default Home;
