import { FormEvent, useContext, useState } from 'react';
import { ChangeMakerWebsiteContext } from 'context/changemakerWebsite-context';
import { ThreeDots } from 'react-bootstrap-icons';
import { useLazyQuery } from '@apollo/client';
import {
    GET_CHANGEMAKER_WEBSITE_SUBDOMAIN,
    GET_BLACKLISTED_DOMAINS
} from '../queries/GetDomainIfExists';
import styles from './style.module.css';

function WebsiteBuilder_settings(): JSX.Element {
    const { changemakerWebsiteState } = useContext(ChangeMakerWebsiteContext);
    const [dropDown, setDropDown] = useState(false);
    const [editable, setEditable] = useState(false);
    const [newSubdomain, setNewSubdomain] = useState('');
    const [subdomainExists, setSubdomainExists] = useState(false);

    const [getBlacklistedDomains] = useLazyQuery(GET_BLACKLISTED_DOMAINS);
    const [getChangemakerDomains] = useLazyQuery(GET_CHANGEMAKER_WEBSITE_SUBDOMAIN);

    const handleSubdomainSubmit = async (e: FormEvent) => {
        setSubdomainExists(false);
        e.preventDefault();
        try {
            const { data } = await getBlacklistedDomains({
                variables: {
                    subdomain: newSubdomain
                }
            });

            // if subdomain exists
            if (data.sapienSubdomains.data.length) {
                setSubdomainExists(true);
            } else {
                // check if the subdomain exists in changemaker tables
                const { data } = await getChangemakerDomains({
                    variables: {
                        subdomain: newSubdomain
                    }
                });
                if (data.changemakerWebsites.data.length) {
                    setSubdomainExists(true);
                }
            }
            //todo: update in templatesName
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <>
            <div
                className="my-2 mr-2"
                style={{ width: '100%', gap: '30px', flexDirection: 'column', display: 'flex' }}
            >
                <div
                    style={{
                        width: '100%',
                        padding: 20,
                        borderRadius: 10,
                        boxShadow:
                            'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px'
                    }}
                    className="bg-dark"
                >
                    <div
                        style={{
                            width: '100%',
                            padding: 20,
                            borderRadius: 10,
                            boxShadow:
                                'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px'
                        }}
                        className="bg-dark"
                    >
                        <div
                            className="d-flex justify-content-between align-items-center"
                            style={{ position: 'relative' }}
                        >
                            <h4
                                className="mb-2"
                                style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}
                            >
                                Community Website
                            </h4>
                            <ThreeDots
                                color="#fff"
                                fill="#fff"
                                fontSize={22}
                                style={{ cursor: 'pointer' }}
                                onClick={() => setDropDown((prev) => !prev)}
                            />
                            {dropDown ? (
                                <div className={styles.dropDown}>
                                    <p
                                        className={styles.selectOptions}
                                        onClick={() => {
                                            setEditable((prev) => !prev);
                                            setDropDown((prev) => !prev);
                                        }}
                                    >
                                        Edit
                                    </p>
                                </div>
                            ) : null}
                        </div>
                        <div>
                            {changemakerWebsiteState.subdomain ? (
                                editable ? (
                                    <>
                                        <div
                                            style={{
                                                color: '#fff',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                padding: '15px 0px'
                                            }}
                                        >
                                            <input
                                                type="text"
                                                value={newSubdomain}
                                                onChange={(e) => setNewSubdomain(e.target.value)}
                                                className={styles.inputStyle}
                                            />
                                            <button
                                                onClick={handleSubdomainSubmit}
                                                className={styles.btnStyle}
                                            >
                                                Submit
                                            </button>
                                            <button
                                                onClick={() => setEditable((prev) => !prev)}
                                                className={`${styles.btnStyle} ${styles.cancelBtn}`}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                        {subdomainExists ? (
                                            <p className={styles.error}>
                                                Subdomain already exists!!
                                            </p>
                                        ) : null}
                                    </>
                                ) : (
                                    <div
                                        style={{
                                            color: '#fff',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            padding: '20px 0px'
                                        }}
                                    >
                                        {changemakerWebsiteState.subdomain}
                                    </div>
                                )
                            ) : (
                                'Not Selected'
                            )}
                        </div>
                    </div>
                    <div
                        style={{
                            color: '#fff',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '20px 0px'
                        }}
                    >
                        {changemakerWebsiteState.subdomain
                            ? changemakerWebsiteState.subdomain
                            : 'Not Selected'}
                    </div>
                </div>
                <div
                    style={{
                        width: '100%',

                        padding: 20,
                        borderRadius: 10,
                        boxShadow:
                            'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px'
                    }}
                    className="bg-dark"
                >
                    <div className="d-flex justify-content-between align-items-center">
                        <h4
                            className="mb-2"
                            style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}
                        >
                            Personal Website
                        </h4>
                        <ThreeDots color="#fff" fill="#fff" fontSize={22} />
                    </div>
                    <div
                        style={{
                            color: '#fff',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '20px 0px'
                        }}
                        className="bg-dark"
                    >
                        {changemakerWebsiteState.domain
                            ? changemakerWebsiteState.domain
                            : 'Not Selected'}
                    </div>
                </div>
            </div>
        </>
    );
}

export default WebsiteBuilder_settings;
