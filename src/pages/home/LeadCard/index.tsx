import { useContext, useEffect, useRef, useState } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { UPDATE_SEEN_NEW } from '../../../builders/client-builder/leads/queries';
import { GET_LEADS } from './queries';
import { flattenObj } from '../../../components/utils/responseFlatten';
import NoDataInCard from '../../../components/NoDataInCard';
import AuthContext from '../../../context/auth-context';
import moment from 'moment';
import './lead.css';

type LeadData = Array<any>;

function LeadComponent() {
    const [leadData, setLeadData] = useState<LeadData>([]);
    const auth = useContext(AuthContext);
    const [page, setPage] = useState<number>(0);
    const [loadingMore, setLoadingMore] = useState<boolean>(false); // Added loading state
    const myElementRef = useRef<HTMLDivElement>(null);
    const [positionTop, setPositionTop] = useState<number>(0);
    const [innerHeight, setInnerHeight] = useState<number>(0);
    const [scrollHeight, setScrollHeight] = useState<number>(0);
    const [totalRecords, setTotalRecords] = useState<number>(0);

    const { data, fetchMore } = useQuery(GET_LEADS, {
        variables: { id: Number(auth.userid), start: page * 2 - 2, limit: 2 },
        onCompleted: (data) => {
            setTotalRecords(data.websiteContactForms.meta.pagination.total);
        }
    });

    const [updateSeenStatus] = useMutation(UPDATE_SEEN_NEW, {
        refetchQueries: [GET_LEADS]
    });

    useEffect(() => {
        const handleScroll = () => {
            const el: HTMLDivElement | null = myElementRef.current;

            if (el) {
                setPositionTop(el.scrollTop);
                setInnerHeight(el.clientHeight);
                setScrollHeight(el.scrollHeight);
            }
        };

        const element: HTMLDivElement | null = myElementRef.current;
        if (element) {
            element.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (element) {
                element.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    useEffect(() => {
        try {
            if (!loadingMore && positionTop + innerHeight + 1 >= scrollHeight) {
                setLoadingMore(true);
                setPage((prevPage) => prevPage + 1);
            }
        } catch (error) {
            console.log(error);
        }
        if (leadData.length === totalRecords) {
            // All leads have been loaded, stop loading more
            setLoadingMore(false);
        }
    }, [positionTop, innerHeight, scrollHeight]);

    useEffect(() => {
        // Handle the new data fetched when the page changes
        if (data && data.websiteContactForms.data.length > 0) {
            setLoadingMore(false);
            const flattenLeadsData = flattenObj({ ...data.websiteContactForms });
            setLeadData((prevData) => [...prevData, ...flattenLeadsData]);
        }
    }, [data]);

    return (
        <Card>
            <Card.Header as="h5" className="bg-dark text-light">
                Lead
            </Card.Header>
            <div className="scrollBar" ref={myElementRef}>
                <Card.Body>
                    {leadData && leadData.length ? (
                        leadData.map((currentValue) => {
                            return (
                                <Card
                                    style={{ cursor: 'pointer' }}
                                    key={currentValue.id}
                                    className="mt-2 bg-white rounded shadow"
                                    onClick={() => {
                                        updateSeenStatus({
                                            variables: {
                                                seen: true,
                                                id: currentValue.id
                                            }
                                        });
                                    }}
                                >
                                    {/* Lead name with mail and call option */}
                                    <Card.Body>
                                        <Row>
                                            <Col md={{ span: 3, offset: 9 }}>
                                                <a
                                                    href={`mailto:${
                                                        currentValue.Details
                                                            ? currentValue.Details.leadsdetails
                                                                  .email
                                                            : null
                                                    }`}
                                                    className="text-dark"
                                                >
                                                    <img
                                                        src="assets/home_page_images/mail.svg"
                                                        alt="mail"
                                                    />
                                                </a>{' '}
                                                <a
                                                    href={`tel:${
                                                        currentValue.Details
                                                            ? currentValue.Details.leadsdetails
                                                                  .phonenumber
                                                            : null
                                                    }`}
                                                    className="text-dark"
                                                >
                                                    <img
                                                        src="assets/home_page_images/call.svg"
                                                        alt="call"
                                                    />
                                                </a>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Card.Title>
                                                    {currentValue.Details
                                                        ? currentValue.Details.leadsdetails.name
                                                        : null}
                                                </Card.Title>
                                            </Col>
                                        </Row>

                                        {/* Message */}
                                        <Card.Subtitle className="mb-2 text-secondary">
                                            {currentValue.Details
                                                ? currentValue.Details.leadsdetails.leadsmesssage
                                                : null}
                                        </Card.Subtitle>

                                        <Card.Text>
                                            Source:{' '}
                                            {currentValue.Details
                                                ? currentValue.Details.source
                                                : null}
                                            <br />
                                            Status:{' '}
                                            {currentValue.Details
                                                ? currentValue.Details.status
                                                : null}
                                        </Card.Text>

                                        <Card.Text>
                                            Updated At:{' '}
                                            {currentValue
                                                ? moment(currentValue.updatedAt).format(
                                                      'MMMM DD,YYYY'
                                                  )
                                                : null}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            );
                        })
                    ) : (
                        <NoDataInCard msg={'No Leads cards to show'} />
                    )}
                    {loadingMore && (
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                fontSize: '17px',
                                marginTop: '10px'
                            }}
                        >
                            Loading more leads...
                        </div>
                    )}
                </Card.Body>
            </div>
        </Card>
    );
}

export default LeadComponent;
