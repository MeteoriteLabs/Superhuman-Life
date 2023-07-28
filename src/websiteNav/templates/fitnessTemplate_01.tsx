import { useContext, useEffect } from 'react';
import PagesComponent from './components/pagesComponent';
import { ChangeMakerWebsiteContext } from '../../context/changemakerWebsite-context';
import styles from '../styles/fitnessTemplate_01.module.css';

function FitnessTemplate_01(): JSX.Element {
    const { changemakerWebsiteState, setChangemakerWebsiteState } =
        useContext(ChangeMakerWebsiteContext);

    useEffect(() => {
        changemakerWebsiteState.subdomain &&
            setChangemakerWebsiteState({
                ...changemakerWebsiteState,
                page: changemakerWebsiteState.subdomain
                    ? changemakerWebsiteState.subdomain.split('/')[3]
                    : ''
            });
        console.log(changemakerWebsiteState.page);
    }, [changemakerWebsiteState.subdomain]);

    return (
        <div className={styles.navContainer}>
            <PagesComponent page={changemakerWebsiteState.page || ''} />
        </div>
    );
}

export default FitnessTemplate_01;
