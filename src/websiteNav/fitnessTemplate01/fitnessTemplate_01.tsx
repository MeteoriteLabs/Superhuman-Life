import PagesComponent from './components/pagesComponent';

import styles from './fitnessTemplate_01.module.css';

function FitnessTemplate_01(): JSX.Element {
    return (
        <div className={styles.navContainer}>
            <PagesComponent />
        </div>
    );
}

export default FitnessTemplate_01;
