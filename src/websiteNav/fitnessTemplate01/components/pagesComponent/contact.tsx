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
                onClick={(e) => {
                    e.stopPropagation();
                    setChangemakerWebsiteState({
                        ...changemakerWebsiteState,
                        section: 'Contact Form'
                    });
                }}
            >
                <WindowFullscreen /> <span className={styles.section_title}>Contact Form</span>
            </div>
        </div>
    );
}

export default Home;
