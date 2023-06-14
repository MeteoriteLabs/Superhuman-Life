import { useState } from 'react';
import Pages from './components/pages';
import PagesComponent from './components/pagesComponent';
import SectionComponent from './components/sectionComponent';

import styles from '../styles/fitnessTemplate_01.module.css';

function FitnessTemplate_01(): JSX.Element {
  const [page, setPage] = useState<string>('');
  const [section, setSection] = useState<string>('');

  return (
    <div className={styles.navContainer}>
      {page === '' && section === '' ? (
        <Pages setPage={setPage} />
      ) : section === '' ? (
        <>
          <PagesComponent page={page} section={section} setSection={setSection} />
          <div onClick={() => setPage('')} className={styles.backButton}>
            👈 Back
          </div>
        </>
      ) : (
        <>
          <SectionComponent section={section} />
          <div onClick={() => setSection('')} className={styles.backButton}>
            👈 Back
          </div>
        </>
      )}
    </div>
  );
}

export default FitnessTemplate_01;
