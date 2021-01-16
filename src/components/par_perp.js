import React, { useState, useEffect } from "react";
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
  const [data, setData] = useState({});

  useEffect(() => {
    if (Object.keys(data).length > 0) {
      var ctx = document.getElementById("plotChartParPerp");
      new Chart(ctx, {
        type: "line",
        data: {
          labels: data.xValues, //Valores de x
          datasets: [
            {
              label: "",
              data: data.eq1yValues, //Valores de y
              fill: false,
              backgroundColor: "black",
              borderColor: "#EC058E",
              lineTension: 0.1,
              spanGaps: false,
            },
            {
              label: "",
              data: data.eq2yValues, //Valores de y
              fill: false,
              backgroundColor: "black", //Punto
              borderColor: "#62BBC1", //Linea
              lineTension: 0.1,
              spanGaps: false,
            },
            {
              label: "",
              data: [{ x: data.x, y: data.y }], //Valores de y
              backgroundColor: "red", //Punto
              lineTension: 0.1,
              pointBorderWidth: 16,
              borderColor: "purple",
              spanGaps: false,
              type: "scatter",
            },
          ],
        },
        options: {
          title: {
            display: true,
            text: "Lineas paralelas y perpendiculares",
          },
        },
      });
    }
  }, [data]);

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
    setData({});
    const params = new URLSearchParams();
    params.append("inp1", eqParameters.inp1);
    params.append("inp2", eqParameters.inp2);
    params.append("inp3", eqParameters.inp3);
    params.append("lineType", eqParameters.lineType);
    params.append("punto1", eqParameters.punto1);
    params.append("punto2", eqParameters.punto2);
    params.append("sign", eqParameters.sign);
    params.append("eqType", eqSelected);
    axios({
      method: "POST",
      url: `http://localhost:8080/GeoCalcApi/Rectas?type=par-perp`,
      data: params,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
      .then((response) => {
        const xmlData = new XMLParser().parseFromString(response.data);
        const values = xmlData.children;
        const eq1Data = values[0].children;
        const eq2Data = values[1].children;

        var eq1yValues = [];
        var eq1xValues = [];
        var eq2yValues = [];

        eq1Data.forEach((value) => {
          const eqValues = value.children;
          eq1xValues.push(eqValues[0].value);
          eq1yValues.push(eqValues[1].value);
        });

        eq2Data.forEach((value) => {
          const eqValues = value.children;
          eq2yValues.push(eqValues[1].value);
        });

        const datos = {
          xValues: eq1xValues,
          eq1yValues,
          eq2yValues,
          x: eqParameters.punto1,
          y: eqParameters.punto2,
        };

        setData(datos);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Ha ocurrido un error al realizar la peticion");
      });
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
