import React, { useState } from "react";
import {
  Container,
  ButtonGroup,
  ToggleButton,
  Form,
  Button,
  ListGroup,
} from "react-bootstrap";
import TeX from "@matejmazur/react-katex";
import { Chart } from "chart.js";
import axios from "axios";

import XMLParser from "react-xml-parser";
import { toast } from "react-toastify";

const eqTypes = [
  { name: "Ecuacion punto - pendiente", value: "pendiente" },
  { name: "Ecuacion general", value: "general" },
];

const defParameters = {
  inp1: 0,
  inp2: 0,
  inp3: 0,
  sign: "+",
  punto1: 0,
  punto2: 0,
  lineType: "paralela",
};

const ParPerp = () => {
  const [eqSelected, setEqSelected] = useState(eqTypes[0].value);
  const [eqParameters, setEqParameters] = useState(defParameters);
  //const [lineToCalc, setLineToCalc] = useState("paralela");
  const [data, setData] = useState({});

  function renderEqButtons() {
    return (
      <div style={{ marginBottom: "22px" }}>
        <Button
          variant="outline-success"
          className="marginSides-12 "
          type="button"
          //onClick={addItem}
        >
          Guardar
        </Button>
        <Button
          variant="outline-info"
          className="marginSides-12 "
          type="button"
          //onClick={updateItem}
          //disabled={!isExample}
        >
          Actualizar
        </Button>
        <Button
          variant="outline-danger"
          className="marginSides-12 "
          type="button"
          //onClick={deleteItem}
          //disabled={!isExample}
        >
          Eliminar
        </Button>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setEqParameters({ ...eqParameters, [e.target.name]: e.target.value });
  };

  function renderSlopeEq() {
    return (
      <div style={{ display: "flex" }}>
        <TeX math="y=" style={{ fontSize: "22px" }} />
        <Form.Control
          type="number"
          style={{ width: "100px" }}
          className="marginSides-12"
          name="inp1"
          value={eqParameters.inp1}
          onChange={handleInputChange}
        />
        <TeX math="x" style={{ fontSize: "22px" }} />
        <Form.Control
          as="select"
          style={{ width: "100px", margin: "0 16px" }}
          name="sign"
          value={eqParameters.sign}
          onChange={handleInputChange}
        >
          <option>+</option>
          <option>-</option>
        </Form.Control>
        <Form.Control
          type="number"
          style={{ width: "100px" }}
          className="marginSides-12"
          name="inp2"
          value={eqParameters.inp2}
          onChange={handleInputChange}
        />
      </div>
    );
  }

  function renderGeneralEq() {
    return (
      <div style={{ display: "flex" }}>
        <Form.Control
          type="number"
          style={{ width: "100px" }}
          className="marginSides-12"
          name="inp1"
          value={eqParameters.inp1}
          onChange={handleInputChange}
        />
        <TeX math="x" style={{ fontSize: "22px" }} />
        <Form.Control
          as="select"
          style={{ width: "100px", margin: "0 16px" }}
          name="sign"
          value={eqParameters.sign}
          onChange={handleInputChange}
        >
          <option>+</option>
          <option>-</option>
        </Form.Control>
        <Form.Control
          type="number"
          style={{ width: "100px" }}
          className="marginSides-12"
          name="inp2"
          value={eqParameters.inp2}
          onChange={handleInputChange}
        />
        <TeX math="y=" style={{ fontSize: "22px" }} />
        <Form.Control
          type="number"
          style={{ width: "100px" }}
          className="marginSides-12"
          name="inp3"
          value={eqParameters.inp3}
          onChange={handleInputChange}
        />
      </div>
    );
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    //console.info(e.target);
    console.info(eqParameters);
  };

  return (
    <Container>
      <h2 className="centerContentHorizontal marginTop-12">
        Recta paralela o perpendicular a un punto
      </h2>
      <h5>Selecciona el tipo de ecuacion</h5>
      <ButtonGroup toggle style={{ margin: "2% 0" }}>
        {eqTypes.map((type, idx) => (
          <ToggleButton
            className="marginSides-12"
            key={idx}
            type="radio"
            variant="secondary"
            name="radio"
            value={type.value}
            checked={eqSelected === type.value}
            onChange={(e) => setEqSelected(e.currentTarget.value)}
          >
            {type.name}
          </ToggleButton>
        ))}
      </ButtonGroup>
      {
        //renderEqButtons()
      }
      <div style={{ margin: "2%" }}>
        <Form onSubmit={handleFormSubmit}>
          {eqSelected === eqTypes[0].value
            ? renderSlopeEq()
            : renderGeneralEq()}
          <div
            style={{ display: "flex", flexWrap: "wrap" }}
            className="marginTop-12"
          >
            <Form.Label style={{ marginRight: "12px", fontSize: "22px" }}>
              Punto:
            </Form.Label>
            <TeX math="(" style={{ fontSize: "22px" }} />
            <Form.Control
              type="number"
              style={{ width: "100px" }}
              className="marginSides-12"
              name="punto1"
              value={eqParameters.punto1}
              onChange={handleInputChange}
            />
            <TeX math="," style={{ fontSize: "22px" }} />
            <Form.Control
              type="number"
              style={{ width: "100px" }}
              className="marginSides-12"
              name="punto2"
              value={eqParameters.punto2}
              onChange={handleInputChange}
            />
            <TeX math=")" style={{ fontSize: "22px" }} />
          </div>
          <Form.Group
            style={{ fontSize: "22px", display: "flex", margin: "12px" }}
          >
            <Form.Label className="marginSides-12">
              Tipo de recta a obtener:
            </Form.Label>
            <Form.Control
              as="select"
              style={{ width: "auto" }}
              name="lineType"
              onChange={handleInputChange}
              value={eqParameters.lineType}
            >
              <option value="paralela">Linea paralela al punto</option>
              <option value="perpendicular">
                Linea perpendicular al punto
              </option>
            </Form.Control>
          </Form.Group>
          <Button
            variant="outline-dark"
            className="marginResponsive"
            style={{ margin: "12px" }}
            type="submit"
          >
            Calcular
          </Button>
        </Form>
        {Object.keys(data).length > 0 ? (
          <canvas
            id="plotChartParPerp"
            style={{ width: "450px", margin: "24px 0" }}
          ></canvas>
        ) : null}
      </div>
    </Container>
  );
};

export default ParPerp;
