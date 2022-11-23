import { useState } from "react";
import { Row, Card } from "react-bootstrap";
import Clients from "./Clients";
import Program from "./Program";

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
              id="inlineRadio1"
              value="option1"
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
              id="inlineRadio2"
              value="option2"
              onChange={(e) => setVariableName("Clients")}
              checked={variableName === "Clients"}
            />
            <label className="form-check-label" htmlFor="inlineRadio2">
              Clients
            </label>
          </div>
        </Row>
        {/* <Container className="mt-3">
          <Row>
            <Col lg={6}>
              <InputGroup className="mb-3 mt-3">
                <FormControl
                  aria-describedby="basic-addon1"
                  placeholder="Search for users or offering name or program name"
                  // ref={searchInput}
                />
                <InputGroup.Prepend>
                  <Button
                    variant="outline-secondary"
                    onClick={(e: any) => {
                      e.preventDefault();
                    }}
                  >
                    <i className="fas fa-search"></i>
                  </Button>
                </InputGroup.Prepend>
              </InputGroup>
            </Col>
          </Row>
        </Container> */}

        {/* <Row>
          <Col lg={3}>
            <button type="button" className="btn btn-success">
              Apply
            </button>
          </Col>
        </Row> */}
      </Card>

      {variableName === "Program" ? <Program /> : null}
      {variableName === "Clients" ? <Clients /> : null}
    </>
  );
}
