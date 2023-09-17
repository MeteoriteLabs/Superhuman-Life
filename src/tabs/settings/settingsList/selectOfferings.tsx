import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_USER_INDUSTRIES_AND_OFFERINGS, UPDATE_PACKAGE_VISIBILITY } from './queries';
import { useContext, useEffect, useState } from 'react';
import authContext from 'context/auth-context';
import Loader from 'components/Loader/Loader';
import { Accordion, Card, Form, ListGroup } from 'react-bootstrap';
import styles from 'selectOfferings.module.css';

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
            }
        }
    );

    const [updateWebsiteVisibility] = useMutation(UPDATE_PACKAGE_VISIBILITY);

    const handleWebsiteVisibilityToggle = (
        offeringId: string,
        visibility: boolean | string | null
    ) => {
        updateWebsiteVisibility({
            variables: {
                fitnessPackageId: offeringId,
                websiteVisibility: visibility === null ? true : visibility === false ? true : false
            }
        });
        setIndustries([]);
        setOfferings([]);
        getIndustriesAndOfferings();

        // setOfferings(
        //     (prevOfferings) =>
        //         prevOfferings &&
        //         prevOfferings.map((offering) =>
        //             offering.id === offeringId
        //                 ? {
        //                       ...offering,
        //                       attributes: {
        //                           ...offering.attributes,
        //                           websiteVisibility:
        //                               offering.attributes.websiteVisibility === 'true'
        //                                   ? null
        //                                   : 'true'
        //                       }
        //                   }
        //                 : offering
        //         )
        // );
    };

    useEffect(() => {
        getIndustriesAndOfferings();
    }, []);

    return (
        <div>
            {industries && industries.length ? (
                <>
                    <Accordion className="mr-2">
                        {industries &&
                            industries.map((industry, index) => (
                                <div key={index}>
                                    <Accordion.Toggle as={Card.Header} eventKey={String(index)}>
                                        {industry.attributes.IndustryName}
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey={String(index)}>
                                        <ListGroup>
                                            <Form inline>
                                                {offerings && offerings.length ? (
                                                    <ListGroup>
                                                        {offerings.map((offering, index) => (
                                                            <ListGroup.Item key={index}>
                                                                <Form.Check
                                                                    type="checkbox"
                                                                    className="text-dark text-left"
                                                                    style={{ width: 'fit-content' }}
                                                                    checked={
                                                                        offering.attributes
                                                                            .websiteVisibility ===
                                                                        true
                                                                            ? true
                                                                            : false
                                                                    }
                                                                    onChange={() => {
                                                                        handleWebsiteVisibilityToggle(
                                                                            offering.id,
                                                                            offering.attributes
                                                                                .websiteVisibility
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
                    </Accordion>
                </>
            ) : (
                <Loader />
            )}
        </div>
    );
};

export default selectOfferings;
