import style from './style.module.css';
import WebsiteNavigation from 'websiteNav';

function WebsiteNav(): JSX.Element {
    return (
        <div className={style.websiteNav}>
            {/* <h3 className={style.websiteNav_h}>SITE NAVIGATION</h3> */}

            <div className={style.websiteNav_ul}>
                <WebsiteNavigation />
            </div>
        </div>
    );
}

export default WebsiteNav;
