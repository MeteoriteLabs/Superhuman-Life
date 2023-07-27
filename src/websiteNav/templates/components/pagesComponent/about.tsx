import { useContext } from 'react';
import styles from './style.module.css';
import { ChangeMakerWebsiteContext } from '../../../../context/changemakerWebsite-context';
import { WindowFullscreen } from 'react-bootstrap-icons';

function About(): JSX.Element {
    const { setChangemakerWebsiteState, changemakerWebsiteState } =
        useContext(ChangeMakerWebsiteContext);
    return (
        <div className="mt-2">
            <div
                className={styles.sectionTitleCont}
                onClick={() => {
                    setChangemakerWebsiteState({
                        ...changemakerWebsiteState,
                        section: 'About: Hero'
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
                        section: 'About: Team'
                    });
                }}
            >
                <WindowFullscreen /> <span className={styles.sectionTitle}>Team</span>
            </div>
        </div>
    );
}

export default About;
