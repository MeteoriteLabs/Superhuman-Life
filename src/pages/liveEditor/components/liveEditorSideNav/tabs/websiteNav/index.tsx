import style from './style.module.css';
import Forms from '../../../../../../forms';

function WebsiteNav(): JSX.Element {
  return (
    <div className={style.websiteNav}>
      {/* <h3 className={style.websiteNav_h}>SITE NAVIGATION</h3> */}

      <div className={style.websiteNav_ul}>
        <Forms />
      </div>
    </div>
  );
}

export default WebsiteNav;
