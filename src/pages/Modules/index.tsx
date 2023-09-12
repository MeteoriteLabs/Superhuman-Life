import React, { useState, useContext, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FETCH_INDUSTRIES, UPDATE_USER_PROFILE_DATA } from './queries';
import { FETCH_USER_PROFILE_DATA } from '../profile/queries/queries';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { flattenObj } from 'components/utils/responseFlatten';
import { AuthContext } from 'builders/session-builder/Fitness/Channel/import';
import Toaster from 'components/Toaster';

const Modules: React.FC<{ show: boolean; onHide: () => void }> = (props) => {
    const [industryData, setIndustryData] = useState<any[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const [selectedIndustryIds, setSelectedIndustryIds] = useState<string[]>([]);
    const [designationSelected, setDesignationSelected] = useState<
        { id?: string; industry?: string; designationsList?: string }[]
    >([] as { id?: string; industry?: string; designationsList?: string }[]);
    const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
    const auth = useContext(AuthContext);
    const [prefilledIndustry, setPreFilledIndustry] = useState<any[]>([]);
    const [prefilledDesignations, setPreFilledDesignations] = useState<any[]>([]);

    const [getUsers]  = useLazyQuery(FETCH_USER_PROFILE_DATA, {
        variables: { id: auth.userid },
        onCompleted: (response) => {
            const flattenData = flattenObj({ ...response });
            console.log(flattenData);
            setPreFilledIndustry(
                flattenData.usersPermissionsUser.industries &&
                    flattenData.usersPermissionsUser.industries.length
                    ? flattenData.usersPermissionsUser.industries
                    : []
            );
            setPreFilledDesignations(
                flattenData.usersPermissionsUser.designations &&
                    flattenData.usersPermissionsUser.designations.length
                    ? flattenData.usersPermissionsUser.designations
                    : []
            );
            // FillDetails(flattenData.usersPermissionsUser);
        }
    });
    // console.log(prefilledDesignations, prefilledIndustry);
    useQuery(FETCH_INDUSTRIES, {
        onCompleted: (response) => {
            const flattenData = flattenObj({ ...response });
            setIndustryData(flattenData.industries);
        }
    });

    const [updateProfile] = useMutation(UPDATE_USER_PROFILE_DATA, {
        onCompleted: () => {
            setIsFormSubmitted(true);
            props.onHide();
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
        getUsers({variables: { id: auth.userid }})
    }, []);

    return (
        <>
            <Modal show={props.show} onHide={props.onHide} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Select Industry</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {industryData && industryData.length
                        ? industryData.map((curr) => (
                              <React.Fragment key={curr.id}>
                                  <input
                                      type="checkbox"
                                      id={curr.id}
                                      name={curr.IndustryName}
                                      value={curr.IndustryName}
                                      style={{ margin: '10px' }}
                                      checked={
                                          prefilledIndustry && prefilledIndustry.length
                                              ? prefilledIndustry.find(
                                                    (preFilledIndustry) =>
                                                        preFilledIndustry.id === curr.id
                                                )
                                              : false
                                      }
                                      //   defaultChecked={prefilledIndustry && prefilledIndustry.length ? prefilledIndustry.find((preFilledIndustry) => preFilledIndustry.id === curr.id) : false}
                                      onChange={(e) => {
                                          const a = e.target.checked ? e.target.value : null;
                                          console.log(a);
                                          setSelected([...selected, e.target.value]);
                                          setSelectedIndustryIds([...selectedIndustryIds, curr.id]);
                                      }}
                                  />
                                  <label htmlFor={curr.IndustryName}>{curr.IndustryName}</label>
                                  <br />
                                  {selected &&
                                  selected.length &&
                                  selected.includes(curr.IndustryName)
                                      ? curr.designations.map((j) => (
                                            <React.Fragment key={j.id}>
                                                <input
                                                    type="checkbox"
                                                    id={j.Designation_title}
                                                    name={j.Designation_title}
                                                    value={j.Designation_title}
                                                    style={{ marginLeft: '30px' }}
                                                    // checked={prefilledDesignations && prefilledDesignations.length ? prefilledDesignations.find((currentPreFilledDesignations) => currentPreFilledDesignations.id === curr.id) : false}
                                                    defaultChecked={
                                                        prefilledDesignations &&
                                                        prefilledDesignations.length
                                                            ? prefilledDesignations.find(
                                                                  (currentPreFilledDesignations) =>
                                                                      currentPreFilledDesignations.id ===
                                                                      curr.id
                                                              )
                                                            : false
                                                    }
                                                    onChange={(e) => {
                                                        // const arr = e.target.checked ?
                                                        // {
                                                        //     id: j.id,
                                                        //     industry: curr.IndustryName,
                                                        //     designationsList: e.target.value
                                                        // } : null

                                                        // ;
                                                        // console.log(arr);

                                                        setDesignationSelected([
                                                            ...designationSelected,
                                                            {
                                                                id: j.id,
                                                                industry: curr.IndustryName,
                                                                designationsList: e.target.value
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
                                                <br />
                                            </React.Fragment>
                                        ))
                                      : null}
                              </React.Fragment>
                          ))
                        : null}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={props.onHide}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleSubmit()}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
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
