import React, { useState, useEffect } from "react";
import {
  Container,
  ButtonGroup,
  ToggleButton,
  Form,
  Button,
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
};

const PointRect = () => {
  const [eqSelected, setEqSelected] = useState(eqTypes[0].value);
  const [eqParameters, setEqParameters] = useState(defParameters);
  const [data, setData] = useState({});

  useEffect(() => {
    if (Object.keys(data).length > 0) {
      const { xValues, yValues, distancia, x, y } = data;
      var ctx = document.getElementById("plotChartPointRect");
      new Chart(ctx, {
        type: "line",
        data: {
          labels: xValues, //Valores de x
          datasets: [
            {
              label: "",
              data: yValues, //Valores de y
              fill: false,
              backgroundColor: "black",
              borderColor: "#EC058E",
              lineTension: 0.1,
              spanGaps: false,
            },
            {
              label: "",
              data: [{ x: x, y: y }], //Valores de y
              backgroundColor: "red", //Punto
              lineTension: 0.1,
              pointRadius: 8,
              borderColor: "purple",
              spanGaps: false,
              type: "scatter",
            },
          ],
        },
        options: {
          title: {
            display: true,
            text: `Distancia: ${distancia}`,
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
    const { inp1, inp2, inp3, punto1, punto2, sign } = eqParameters;
    params.append("inp1", inp1 ? inp1 : "0");
    params.append("inp2", inp2 ? inp2 : "0");
    params.append("inp3", inp3 ? inp3 : "0");
    params.append("x", punto1 ? punto1 : "0");
    params.append("y", punto2 ? punto2 : "0");
    params.append("sign", sign);
    params.append("eqType", eqSelected);
    axios({
      method: "POST",
      url: `http://localhost:8080/GeoCalcApi/Puntos?type=point_rect`,
      data: params,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
      .then((response) => {
        const xmlData = new XMLParser().parseFromString(response.data);
        const values = xmlData.children;
        //console.info(values);
        const distancia = values[0].value;
        const eqCoords = values[1].children;

        var yValues = [];
        var xValues = [];

        eqCoords.forEach((value) => {
          const eqValues = value.children;
          xValues.push(eqValues[0].value);
          yValues.push(eqValues[1].value);
        });

        const datos = {
          xValues,
          yValues,
          distancia,
          x: punto1,
          y: punto2,
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
        Distancia de una recta a un punto
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
            id="plotChartPointRect"
            style={{ width: "450px", margin: "24px 0" }}
          ></canvas>
        ) : null}
      </div>
    </Container>
  );
};

export default PointRect;
