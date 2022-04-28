import React, { useState, useEffect } from 'react';
import { FormControl } from 'react-bootstrap';
import { GET_FITNESSPACKAGE_DETAILS } from './queries';
import { useQuery } from "@apollo/client";
import {flattenObj} from '../utils/responseFlatten';

const ClassTypeSelect = (props: any) => {

    const [fitnessPackageTypes, setFitnessPackageTypes] = useState<any>([]);
    const [selectedFitnessPackage, setSelectedFitnessPackage] = useState("");
    const urlList = window.location.pathname.split("/");

    useQuery(GET_FITNESSPACKAGE_DETAILS, {onCompleted: (data) => {
        const flattenData = flattenObj({...data});
        setFitnessPackageTypes(flattenData.fitnessPackageTypes);
    }});

    useEffect(() => {
        if(urlList[1] === "pt") {
            setSelectedFitnessPackage('Personal Training');
        }else if(urlList[1] === "group") {
            setSelectedFitnessPackage('Group Class');
        }else if(urlList[1] === "Classic") {
            setSelectedFitnessPackage('Classic Class');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);


    props.onChange(selectedFitnessPackage);

    return (
        <div className="mr-5">
            <span><b>Select Fitness Package type</b></span>
            <FormControl value={selectedFitnessPackage} 
            disabled={urlList[1] === 'pt' || urlList[1] === 'group' || urlList[1] === 'classic'}  
            as="select" onChange={(e) => setSelectedFitnessPackage(e.target.value)}>
                <option>Choose Type</option>
                {fitnessPackageTypes.slice(0,4).map((item) => {
                    return <option value={item.type}>{item.type}</option>
                })}
            </FormControl>
        </div>
    )
}

export default ClassTypeSelect;