import { useState, useEffect } from "react";
import { FormControl } from "react-bootstrap";
import { GET_FITNESSPACKAGE_DETAILS } from "./queries";
import { useQuery } from "@apollo/client";
import { flattenObj } from "../utils/responseFlatten";

const ClassTypeSelect = (props: any) => {
  const [fitnessPackageTypes, setFitnessPackageTypes] = useState<any>([]);
  const [selectedFitnessPackage, setSelectedFitnessPackage] = useState(
    props.value ? props.value : ""
  );
  const urlList = window.location.pathname.split("/");

  useQuery(GET_FITNESSPACKAGE_DETAILS, {
    onCompleted: (data) => {
      const flattenData = flattenObj({ ...data });
      setFitnessPackageTypes(flattenData.fitnessPackageTypes);
    },
  });

  useEffect(() => {
    if (urlList[1] === "pt") {
      setSelectedFitnessPackage("One-On-One");
    }
    if (urlList[1] === "group") {
      setSelectedFitnessPackage("Group Class");
    }
    if (urlList[1] === "classic") {
      setSelectedFitnessPackage("Classic Class");
    }
    if (urlList[1] === "cohort") {
      setSelectedFitnessPackage("Cohort");
    }
    if (urlList[1] === "channel") {
      setSelectedFitnessPackage("Live Stream Channel");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (
    selectedFitnessPackage !== "" &&
    selectedFitnessPackage !== "Choose Type"
  ) {
    props.onChange(selectedFitnessPackage);
  } else {
    props.onChange(undefined);
  }

  return (
    <div className="mr-5">
      <span>
        <b>Select Fitness Offering type</b>
      </span>
      <FormControl
        value={selectedFitnessPackage}
        disabled={
          urlList[1] === "pt" ||
          urlList[1] === "group" ||
          urlList[1] === "classic" ||
          urlList[1] === "cohort" ||
          urlList[1] === "channel"
        }
        as="select"
        onChange={(e) => setSelectedFitnessPackage(e.target.value)}
      >
        <option>Choose Type</option>
        {fitnessPackageTypes.slice(0, 7).map((item, index: number) => {
          return (
            <option key={index} value={item.type}>
              {item.type}
            </option>
          );
        })}
      </FormControl>
    </div>
  );
};

export default ClassTypeSelect;
