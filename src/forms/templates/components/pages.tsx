import styles from '../../styles/fitnessTemplate_01.module.css'

function Pages({ setPage }: { setPage: (page: string) => void }): JSX.Element {
    return (
        <div className="mt-2">
            <p
                className={styles.pageTitle}
                onClick={() => {
                    setPage('home')
                }}
            >
                Home
            </p>
            <p
                className={styles.pageTitle}
                onClick={() => {
                    setPage('classes')
                }}
            >
                Classes
            </p>
            <p
                className={styles.pageTitle}
                onClick={() => {
                    setPage('about')
                }}
            >
                About Us
            </p>

            <p
                className={styles.pageTitle}
                onClick={() => {
                    setPage('contact')
                }}
            >
                Contact
            </p>
        </div>
    )
}

export default Pages
