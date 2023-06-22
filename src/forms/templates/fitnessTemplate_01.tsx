import { useState } from 'react';
import Pages from './components/pages';
import PagesComponent from './components/pagesComponent';
import SectionComponent from './components/sectionComponent';

import styles from '../styles/fitnessTemplate_01.module.css';
import { SetFirstLetterToUpperCase } from '../../lib/StringManipulation';

function FitnessTemplate_01(): JSX.Element {
  const [page, setPage] = useState<string>('');
  const [section, setSection] = useState<string>('');

  return (
    <div className={styles.navContainer}>
      <div className={styles.breadCrumb}>
        <div
          className={styles.breadCrumbText}
          onClick={() => {
            setPage('');
            setSection('');
          }}
          style={{ color: page ? '#999' : '#fff' }}>
          Pages &nbsp;
        </div>
        {page ? (
          <div
            className={styles.breadCrumbText}
            onClick={() => {
              setSection('');
            }}
            style={{ color: section ? '#999' : '#fff' }}>
            /&nbsp; {SetFirstLetterToUpperCase(page)} &nbsp;
          </div>
        ) : null}
        {section ? (
          <div className={styles.breadCrumbText}>/&nbsp; {SetFirstLetterToUpperCase(section)} </div>
        ) : null}
      </div>
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
          <div onClick={() => setSection('')} className={styles.sectionBackButton}>
            👈 Back
          </div>
        </>
      )}
    </div>
  );
}

export default FitnessTemplate_01;
