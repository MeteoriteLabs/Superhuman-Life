import { useContext, useEffect, useState } from 'react';
import PagesComponent from './components/pagesComponent';
import { ChangeMakerWebsiteContext } from '../../context/changemakerWebsite-context';
import styles from '../styles/fitnessTemplate_01.module.css';

function FitnessTemplate_01(): JSX.Element {
    const [page, setPage] = useState<string>('');

    const { changemakerWebsiteState, setChangemakerWebsiteState } =
        useContext(ChangeMakerWebsiteContext);

    useEffect(() => {
        changemakerWebsiteState.subdomain &&
            setPage(changemakerWebsiteState.subdomain.split('/')[3] || '');
        setChangemakerWebsiteState({
            ...changemakerWebsiteState,
            page: changemakerWebsiteState.subdomain
                ? changemakerWebsiteState.subdomain.split('/')[3]
                : ''
        });
    }, []);

    return (
        <div className={styles.navContainer}>
            <PagesComponent page={page} />
        </div>
    );
}

export default FitnessTemplate_01;
