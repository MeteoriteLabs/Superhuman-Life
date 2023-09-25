import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_USER_INDUSTRIES_AND_OFFERINGS, UPDATE_PACKAGE_VISIBILITY } from './queries';
import { useContext, useEffect, useState } from 'react';
import authContext from 'context/auth-context';
import Loader from 'components/Loader/Loader';
import { Accordion, Card, Form, ListGroup } from 'react-bootstrap';

interface Industries {
    attributes: {
        IndustryName: string;
    };
}

interface Offerings {
    id: string;
    attributes: {
        Industry: { data: null };
        packagename: string;
        websiteVisibility: string | null | boolean;
    };
}

const selectOfferings = (): JSX.Element => {
    const [industries, setIndustries] = useState<Industries[]>();
    const [offerings, setOfferings] = useState<Offerings[]>();
    const [otherOfferings, setOtherfferings] = useState<Offerings[]>();

    const { userid } = useContext(authContext);

    const [getIndustriesAndOfferings, { data: get_user_industries_and_offerings }] = useLazyQuery(
        GET_USER_INDUSTRIES_AND_OFFERINGS,
        {
            variables: {
                userId: userid
            },
            onCompleted: () => {
                setOfferings(
                    get_user_industries_and_offerings.usersPermissionsUser.data.attributes
                        .fitnesspackages.data
                );

                setIndustries(
                    get_user_industries_and_offerings.usersPermissionsUser.data.attributes
                        .industries.data
                );

                setOtherfferings(
                    get_user_industries_and_offerings.usersPermissionsUser.data.attributes.fitnesspackages.data.filter(
                        (offering) =>
                            !get_user_industries_and_offerings.usersPermissionsUser.data.attributes.industries.data.includes(
                                offering.attributes.Industry.data
                            )
                    )
                );
            }
        }
    );

    const [updateWebsiteVisibility] = useMutation(UPDATE_PACKAGE_VISIBILITY);

    const handleWebsiteVisibilityToggle = ({
        offeringId,
        visibility,
        industry
    }: {
        offeringId?: string;
        visibility?: boolean | null | string;
        industry?: string;
    }) => {
        if (industry === 'other') {
            otherOfferings?.forEach((offering) =>
                updateWebsiteVisibility({
                    variables: {
                        fitnessPackageId: offering.id,
                        websiteVisibility:
                            visibility === null ? true : visibility === false ? true : false
                    }
                })
            );
        } else {
            updateWebsiteVisibility({
                variables: {
                    fitnessPackageId: offeringId,
                    websiteVisibility:
                        visibility === null ? true : visibility === false ? true : false
                }
            });
        }
        setIndustries([]);
        setOfferings([]);
        getIndustriesAndOfferings();
    };

    useEffect(() => {
        getIndustriesAndOfferings();
    }, []);

    return (
        <div>
            {industries && industries.length ? (
                <>
                    <Accordion className="mr-2" style={{ cursor: 'pointer' }}>
                        {industries &&
                            industries.map((industry, index) => (
                                <div key={index}>
                                    {offerings &&
                                    offerings.filter(
                                        (offering) =>
                                            offering.attributes.Industry.data ===
                                            industry.attributes.IndustryName
                                    ).length ? (
                                        <Accordion.Toggle
                                            as={Card.Header}
                                            eventKey={String(index)}
                                            className="d-flex"
                                        >
                                            <Form.Check
                                                type="checkbox"
                                                id={`${industry.attributes.IndustryName + index}`}
                                                checked={true}
                                            />
                                            {industry.attributes.IndustryName}
                                        </Accordion.Toggle>
                                    ) : (
                                        <Accordion.Toggle
                                            as={Card.Header}
                                            eventKey={String(index)}
                                            style={{ color: '#aaa', cursor: 'not-allowed' }}
                                            className="d-flex"
                                        >
                                            <Form.Check
                                                type="checkbox"
                                                id={`${industry.attributes.IndustryName + index}`}
                                                checked={false}
                                            />
                                            {industry.attributes.IndustryName}
                                        </Accordion.Toggle>
                                    )}
                                    <Accordion.Collapse eventKey={String(index)}>
                                        <ListGroup>
                                            <Form inline>
                                                {offerings && offerings.length ? (
                                                    <ListGroup>
                                                        {offerings
                                                            .filter(
                                                                (offering) =>
                                                                    offering.attributes.Industry
                                                                        .data ===
                                                                    industry.attributes.IndustryName
                                                            )
                                                            .map((offering, index) => (
                                                                <ListGroup.Item key={index}>
                                                                    <Form.Check
                                                                        type="checkbox"
                                                                        className="text-dark text-left"
                                                                        style={{
                                                                            width: 'fit-content'
                                                                        }}
                                                                        checked={
                                                                            offering.attributes
                                                                                .websiteVisibility ===
                                                                            true
                                                                                ? true
                                                                                : false
                                                                        }
                                                                        onChange={() => {
                                                                            handleWebsiteVisibilityToggle(
                                                                                {
                                                                                    offeringId:
                                                                                        offering.id,
                                                                                    visibility:
                                                                                        offering
                                                                                            .attributes
                                                                                            .websiteVisibility
                                                                                }
                                                                            );
                                                                        }}
                                                                        id={
                                                                            offering.id +
                                                                            offering.attributes
                                                                                .packagename
                                                                        }
                                                                        label={
                                                                            offering.attributes
                                                                                .packagename
                                                                        }
                                                                        custom
                                                                    />
                                                                </ListGroup.Item>
                                                            ))}
                                                    </ListGroup>
                                                ) : null}
                                            </Form>
                                        </ListGroup>
                                    </Accordion.Collapse>
                                </div>
                            ))}

                        <div>
                            <Accordion.Toggle
                                as={Card.Header}
                                eventKey={String(12121)}
                                className="d-flex"
                            >
                                <Form.Check
                                    type="checkbox"
                                    id={`other12312321`}
                                    checked={
                                        otherOfferings &&
                                        otherOfferings.some(
                                            (offering) =>
                                                offering.attributes.websiteVisibility === true
                                        )
                                    }
                                    onChange={() => {
                                        handleWebsiteVisibilityToggle({
                                            industry: 'other',
                                            visibility:
                                                otherOfferings &&
                                                otherOfferings.some(
                                                    (offering) =>
                                                        offering.attributes.websiteVisibility ===
                                                        true
                                                )
                                        });
                                    }}
                                />
                                Other
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey={String(12121)}>
                                <ListGroup>
                                    <Form inline>
                                        {otherOfferings && otherOfferings.length ? (
                                            <ListGroup>
                                                {otherOfferings.map((offering, index) => (
                                                    <ListGroup.Item key={index}>
                                                        <Form.Check
                                                            type="checkbox"
                                                            className="text-dark text-left"
                                                            style={{
                                                                width: 'fit-content'
                                                            }}
                                                            checked={
                                                                offering.attributes
                                                                    .websiteVisibility === true
                                                                    ? true
                                                                    : false
                                                            }
                                                            onChange={() => {
                                                                handleWebsiteVisibilityToggle({
                                                                    offeringId: offering.id,
                                                                    visibility:
                                                                        offering.attributes
                                                                            .websiteVisibility
                                                                });
                                                            }}
                                                            id={
                                                                offering.id +
                                                                offering.attributes.packagename
                                                            }
                                                            label={offering.attributes.packagename}
                                                            custom
                                                        />
                                                    </ListGroup.Item>
                                                ))}
                                            </ListGroup>
                                        ) : null}
                                    </Form>
                                </ListGroup>
                            </Accordion.Collapse>
                        </div>
                    </Accordion>
                </>
            ) : (
                <Loader />
            )}
        </div>
    );
};

export default selectOfferings;
