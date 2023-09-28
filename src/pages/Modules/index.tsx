import React, { useState, useContext, useEffect } from 'react';
import { Button, Card, Row, Col, Form } from 'react-bootstrap';
import { FETCH_INDUSTRIES, UPDATE_USER_PROFILE_DATA } from './queries';
import { GET_FITNESS } from 'builders/package-builder/fitness/graphQL/queries';
import { FETCH_USER_PROFILE_DATA } from '../profile/queries/queries';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { flattenObj } from 'components/utils/responseFlatten';
import { AuthContext } from 'builders/session-builder/Fitness/Channel/import';
import Toaster from 'components/Toaster';
import { Link } from 'react-router-dom';
import Loader from 'components/Loader/Loader';

const Modules: React.FC<{ show: boolean; onHide: () => void }> = () => {
    const [industryData, setIndustryData] = useState<any[]>([]);
    const [selectedIndustryIds, setSelectedIndustryIds] = useState<string[]>([]);
    const [designationSelected, setDesignationSelected] = useState<
        { id: string; industry: string; designationsList: string }[]
    >([] as { id: string; industry: string; designationsList: string }[]);
    const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
    const auth = useContext(AuthContext);
    const [prefilledIndustry, setPreFilledIndustry] = useState<any[]>([]);
    const [prefilledDesignations, setPreFilledDesignations] = useState<any[]>([]);
    const [fitness, setFitness] = useState<any[]>();

    useQuery(GET_FITNESS, {
        variables: {id: auth.userid, pageSize: 1000},
        onCompleted: (response) => {  
            const flattenData = flattenObj({ ...response });
            setFitness(flattenData.fitnesspackages)
            
        }
    });

    const [getUsers] = useLazyQuery(FETCH_USER_PROFILE_DATA, {
        variables: { id: auth.userid },
        onCompleted: (response) => {
            const flattenData = flattenObj({ ...response });

            setPreFilledIndustry(
                flattenData.usersPermissionsUser.industries &&
                    flattenData.usersPermissionsUser.industries.length
                    ? flattenData.usersPermissionsUser.industries
                    : []
            );
            setSelectedIndustryIds(
                flattenData.usersPermissionsUser.industries &&
                    flattenData.usersPermissionsUser.industries.length
                    ? flattenData.usersPermissionsUser.industries.map((curr) => curr.id)
                    : []
            );
            setPreFilledDesignations(
                flattenData.usersPermissionsUser.designations &&
                    flattenData.usersPermissionsUser.designations.length
                    ? flattenData.usersPermissionsUser.designations
                    : []
            );
            setDesignationSelected(
                flattenData.usersPermissionsUser.designations &&
                    flattenData.usersPermissionsUser.designations.length
                    ? flattenData.usersPermissionsUser.designations
                    : []
            );
        }
    });

    const { loading } = useQuery(FETCH_INDUSTRIES, {
        onCompleted: (response) => {
            const flattenData = flattenObj({ ...response });
            setIndustryData(flattenData.industries);
        }
    });

    const [updateProfile] = useMutation(UPDATE_USER_PROFILE_DATA, {
        onCompleted: () => {
            setIsFormSubmitted(true);
        }
    });

    function updateBasicDetails() {
        updateProfile({
            variables: {
                id: auth.userid,
                data: {
                    designations: designationSelected.map((curr) => curr.id),
                    industries: selectedIndustryIds
                }
            }
        });
    }

    function handleSubmit() {
        updateBasicDetails();
    }

    useEffect(() => {
        getUsers({ variables: { id: auth.userid } });
    }, []);

    if (loading) return <Loader msg="Industries are loading..." />;

    return (
        <>
            <div>
                <div className="mb-3">
                    <span style={{ fontSize: '30px' }}>
                        <Link to="/profile">
                            <i className="fa fa-arrow-circle-left" style={{ color: 'black' }}></i>
                        </Link>
                        <b> Module Settings</b>
                    </span>
                </div>

                <div className="pt-5">
                    {industryData && industryData.length
                        ? industryData.map((curr) => (
                              <Card className="p-3" key={curr.id}>
                                  <Row>
                                      <Col sm={12}>
                                          <Form>
                                              <Form.Check
                                                  title={fitness && fitness.length ? (fitness.filter((industry) => industry.Industry?.id === curr.id).length.toString()+ " services exist for this industry, delete all the services to unselect this industry." )
                                                     : 'You have 0 services for this industry'}
                                                  type="switch"
                                                  id={curr.id}
                                                  value={curr.IndustryName}
                                                  label={curr.IndustryName}
                                                  defaultChecked={
                                                      prefilledIndustry && prefilledIndustry.length
                                                          ? prefilledIndustry.find(
                                                                (preFilledIndustry) =>
                                                                    preFilledIndustry.id === curr.id
                                                            )
                                                          : false
                                                  }
                                                  disabled={
                                                      (selectedIndustryIds &&
                                                      selectedIndustryIds.length &&
                                                      selectedIndustryIds.length === 1) 
                                                      || (fitness && fitness.length ? ((fitness.findIndex((industry) => industry.Industry?.id === curr.id) > -1 )
                                                      ) : 1
                                                      )
                                                          ? true
                                                          : false
                                                  }
                                                  onChange={(e) => {
                                                     

                                                      let isDeselect = false;
                                                      const updatedValue =
                                                          prefilledIndustry &&
                                                          prefilledIndustry.length
                                                              ? prefilledIndustry.filter((i) => {
                                                                    if (
                                                                        i.IndustryName ===
                                                                        e.target.value
                                                                    )
                                                                        isDeselect = true;
                                                                    return (
                                                                        i.IndustryName !==
                                                                        e.target.value
                                                                    );
                                                                })
                                                              : prefilledIndustry;

                                                      const ids = updatedValue.map((cur) => cur.id);

                                                      setPreFilledIndustry(updatedValue);

                                                      if (isDeselect) {
                                                          setSelectedIndustryIds(ids);
                                                      } else {
                                                          setSelectedIndustryIds([
                                                              ...new Set([
                                                                  ...selectedIndustryIds,
                                                                  curr.id
                                                              ])
                                                          ]);
                                                      }
                                                  }}
                                              />
                                          </Form>
                                      </Col>
                                      <Col sm={12} className="mt-4">
                                          {curr && curr.designations && curr.designations.length
                                              ? curr.designations.map((j) => (
                                                    <React.Fragment key={j.id}>
                                                        <input
                                                            type="checkbox"
                                                            id={j.Designation_title}
                                                            name={j.Designation_title}
                                                            value={j.Designation_title}
                                                            style={{ marginLeft: '30px' }}
                                                            disabled={
                                                                designationSelected &&
                                                                designationSelected.length &&
                                                                designationSelected.length === 1
                                                                    ? true
                                                                    : false
                                                            }
                                                            defaultChecked={
                                                                prefilledDesignations &&
                                                                prefilledDesignations.length
                                                                    ? prefilledDesignations.find(
                                                                          (
                                                                              currentPreFilledDesignations
                                                                          ) =>
                                                                              currentPreFilledDesignations.id ===
                                                                              j.id
                                                                      )
                                                                    : false
                                                            }
                                                            onChange={(e) => {
                                                                setDesignationSelected([
                                                                    ...designationSelected,
                                                                    {
                                                                        id: j.id,
                                                                        industry: curr.IndustryName,
                                                                        designationsList:
                                                                            e.target.value
                                                                    }
                                                                ]);
                                                            }}
                                                        />
                                                        <label
                                                            htmlFor={j.Designation_title}
                                                            style={{ marginLeft: '5px' }}
                                                        >
                                                            {j.Designation_title}
                                                        </label>
                                                    </React.Fragment>
                                                ))
                                              : null}
                                      </Col>
                                  </Row>
                              </Card>
                          ))
                        : null}

                    <Row className="justify-content-center mt-3 col-lg-12">
                        <Button variant="dark" onClick={handleSubmit}>
                            Save
                        </Button>
                    </Row>
                </div>
            </div>

            {/* success toaster notification */}
            {isFormSubmitted ? (
                <Toaster
                    handleCallback={() => setIsFormSubmitted(!isFormSubmitted)}
                    type="success"
                    msg="Industries and designations has been updated"
                />
            ) : null}

        </>
    );
};

export default Modules;
