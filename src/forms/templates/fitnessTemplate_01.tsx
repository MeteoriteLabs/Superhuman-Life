import { useState } from 'react';
import styles from '../styles/fitnessTemplate_01.module.css';
import Pages from './components/pages';
import Sections from './components/sections';
import { Link } from 'react-router-dom';

function FitnessTemplate_01(): JSX.Element {
  const [page, setPage] = useState<string>('');

  return (
    <div className={styles.navContainer}>
      {page === '' ? (
        <Pages setPage={setPage} />
      ) : (
        <>
          <Sections page={page} />
          <div onClick={() => setPage('')}>Back</div>
        </>
      )}
    </div>
  );
}

export default FitnessTemplate_01;
