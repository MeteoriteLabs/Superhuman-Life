import { Link } from 'react-router-dom';
import style from './style.module.css';

function WebsiteNav(): JSX.Element {
  return (
    <div className={style.websiteNav}>
      <h3 className={style.websiteNav_h}>SITE NAVIGATION</h3>

      <div className={style.websiteNav_ul}>
        <Link to="#" className={style.links}>
          Home
        </Link>

        <Link to="#" className={style.links}>
          About
        </Link>

        <Link to="#" className={style.links}>
          Services
        </Link>

        <Link to="#" className={style.links}>
          Contact
        </Link>
      </div>
    </div>
  );
}

export default WebsiteNav;
