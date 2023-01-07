import { useState } from "react";
import { Row, Card } from "react-bootstrap";
import Clients from "./Clients";
import Program from "./Program";
import './style.css';

export default function Sessions() {
  const [variableName, setVariableName] = useState<String>("Program");

  return (
    <>
      <Card className="mt-4 p-3">
        <h5>Filters</h5>
        <Row className="p-3">
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="inlineRadioOptions"
              id="auto"
              value="program"
              onChange={(e) => setVariableName("Program")}
              checked={variableName === "Program"}
            />
            <label className="form-check-label" htmlFor="inlineRadio1">
              Program name
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="inlineRadioOptions"
              id="auto"
              value="clients"
              onChange={(e) => setVariableName("Clients")}
              checked={variableName === "Clients"}
            />
            <label className="form-check-label" htmlFor="inlineRadio2">
              Clients
            </label>
          </div>
        </Row>
      </Card>

      {variableName === "Program" ? <Program /> : null}
      {variableName === "Clients" ? <Clients /> : null}
    </>
  );
}
