import { useContext, useEffect, useState } from 'react';
import PagesComponent from './components/pagesComponent';
import { ChangeMakerWebsiteContext } from '../../context/changemakerWebsite-context';
import styles from '../styles/fitnessTemplate_01.module.css';

function FitnessTemplate_01(): JSX.Element {
    const [page, setPage] = useState<string>('');

    const { changemakerWebsiteState } = useContext(ChangeMakerWebsiteContext);

    useEffect(() => {
        changemakerWebsiteState.subdomain &&
            setPage(changemakerWebsiteState.subdomain.split('/')[3] || '');
    }, []);

    return (
        <div className={styles.navContainer}>
            <PagesComponent page={page} />
        </div>
    );
}

export default FitnessTemplate_01;

{
    /* <div className={styles.breadCrumb}>
<div
    className={styles.breadCrumbText}
    onClick={() => {
        setPage('');
        setSection('');
    }}
    style={{ color: page ? '#999' : '#fff' }}
>
    Pages &nbsp;
</div>
{page ? (
    <div
        className={styles.breadCrumbText}
        onClick={() => {
            setSection('');
        }}
        style={{ color: section ? '#999' : '#fff' }}
    >
        /&nbsp; {SetFirstLetterToUpperCase(page)} &nbsp;
    </div>
) : null}
{section ? (
    <div className={styles.breadCrumbText}>
        /&nbsp; {SetFirstLetterToUpperCase(section)}{' '}
    </div>
) : null}
</div> */
}
