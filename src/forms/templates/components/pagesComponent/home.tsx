import styles from './style.module.css';

function Home({
    section,
    setSection
}: {
    section: string;
    setSection: (param: string) => void;
}): JSX.Element {
    return (
        <div className="mt-2">
            <p
                className={styles.sectionTitle}
                onClick={() => {
                    setSection('Home: Hero');
                }}
            >
                Hero
            </p>
            <p
                className={styles.sectionTitle}
                onClick={() => {
                    setSection('Home: Features');
                }}
            >
                Features
            </p>
            <p
                className={styles.sectionTitle}
                onClick={() => {
                    setSection('Home: Cta');
                }}
            >
                Cta
            </p>

            <p
                className={styles.sectionTitle}
                onClick={() => {
                    setSection('Home: Pricing');
                }}
            >
                Pricing
            </p>
            <p
                className={styles.sectionTitle}
                onClick={() => {
                    setSection('Home: Testimonials');
                }}
            >
                Testimonials
            </p>
        </div>
    );
}

export default Home;
