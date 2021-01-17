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
  eq1_inp1: 0,
  eq1_inp2: 0,
  eq1_inp3: 0,
  eq1_sign: "+",
  eq2_inp1: 0,
  eq2_inp2: 0,
  eq2_inp3: 0,
  eq2_sign: "+",
};

const CalcIntRect = () => {
  const [eqSelected, setEqSelected] = useState(eqTypes[0].value);
  const [eqParameters, setEqParameters] = useState(defParameters);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (data !== null && Object.keys(data).length > 0) {
      var ctx = document.getElementById("plotChartInt");
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
          ],
        },
        options: {
          title: {
            display: true,
            text: data.intText,
          },
        },
      });
    }
  }, [data]);

  function generateData(xmlData) {
    const values = xmlData.children;
    const eq1Rect = values[0].children;
    const eq2Rect = values[1].children;
    var xInt = 0;
    var yInt = 0;
    var intText = "";
    if (values[2].name === "error") {
      intText = "No hay interseccion. Las lineas son paralelas";
    } else {
      xInt = values[2].value;
      yInt = values[3].value;
      intText = `La interseccion se encuentra en: (${xInt},${yInt})`;
    }
    var eq1yValues = [];
    var eq1xValues = [];
    var eq2yValues = [];

    eq1Rect.forEach((value) => {
      const eqValues = value.children;
      eq1xValues.push(eqValues[0].value);
      eq1yValues.push(eqValues[1].value);
    });
    eq2Rect.forEach((value) => {
      const eqValues = value.children;
      eq2yValues.push(eqValues[1].value);
    });

    const datos = {
      xValues: eq1xValues,
      eq1yValues,
      eq2yValues,
      xInt,
      yInt,
      intText,
    };

    setData(datos);
  }

  const onSubmitSlope = (e) => {
    e.preventDefault();
    setData({});
    const {
      eq1_inp1,
      eq1_inp2,
      eq1_sign,
      eq2_inp1,
      eq2_inp2,
      eq2_sign,
    } = eqParameters;
    const params = new URLSearchParams();
    params.append("eq1inp1", eq1_inp1 === "" ? "0" : eq1_inp1);
    params.append("eq1inp2", eq1_inp2 === "" ? "0" : eq1_inp2);
    params.append("eq1sign", eq1_sign);
    params.append("eq2inp1", eq2_inp1 === "" ? "0" : eq2_inp1);
    params.append("eq2inp2", eq2_inp2 === "" ? "0" : eq2_inp2);
    params.append("eq2sign", eq2_sign);
    axios({
      method: "POST",
      url: "http://localhost:8080/GeoCalcApi/Rectas?type=interseccion",
      data: params,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
      .then((response) => {
        const xmlData = new XMLParser().parseFromString(response.data);
        generateData(xmlData);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Ha ocurrido un error al resolver la ecuacion");
      });
  };

  const onSubmitGeneral = (e) => {
    e.preventDefault();
    setData({});
    const {
      eq1_inp1,
      eq1_inp2,
      eq1_inp3,
      eq1_sign,
      eq2_inp1,
      eq2_inp2,
      eq2_inp3,
      eq2_sign,
    } = eqParameters;
    const params = new URLSearchParams();
    params.append("eq1inp1", eq1_inp1 === "" ? "0" : eq1_inp1);
    params.append("eq1inp2", eq1_inp2 === "" ? "0" : eq1_inp2);
    params.append("eq1inp3", eq1_inp3 === "" ? "0" : eq1_inp3);
    params.append("eq1sign", eq1_sign);
    params.append("eq2inp1", eq2_inp1 === "" ? "0" : eq2_inp1);
    params.append("eq2inp2", eq2_inp2 === "" ? "0" : eq2_inp2);
    params.append("eq2inp3", eq2_inp3 === "" ? "0" : eq2_inp3);
    params.append("eq2sign", eq2_sign);
    params.append("eqsType", "general");
    axios({
      method: "POST",
      url: "http://localhost:8080/GeoCalcApi/Rectas?type=interseccion",
      data: params,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
      .then((response) => {
        const xmlData = new XMLParser().parseFromString(response.data);
        generateData(xmlData);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Ha ocurrido un error al resolver la ecuacion");
      });
  };

  const handleInputChange = (e) => {
    setEqParameters({ ...eqParameters, [e.target.name]: e.target.value });
  };

  function renderSlopeEq(eqNo) {
    return (
      <div style={{ display: "flex" }}>
        <TeX math="y=" style={{ fontSize: "22px" }} />
        <Form.Control
          type="number"
          style={{ width: "100px" }}
          className="marginSides-12"
          name={`eq${eqNo}_inp1`}
          value={eqParameters[`eq${eqNo}_inp1`]}
          onChange={handleInputChange}
        />
        <TeX math="x" style={{ fontSize: "22px" }} />
        <Form.Control
          as="select"
          style={{ width: "100px", margin: "0 16px" }}
          name={`eq${eqNo}_sign`}
          value={eqParameters[`eq${eqNo}_sign`]}
          onChange={handleInputChange}
        >
          <option>+</option>
          <option>-</option>
        </Form.Control>
        <Form.Control
          type="number"
          style={{ width: "100px" }}
          className="marginSides-12"
          name={`eq${eqNo}_inp2`}
          value={eqParameters[`eq${eqNo}_inp2`]}
          onChange={handleInputChange}
        />
      </div>
    );
  }

  function renderGeneralEq(eqNo) {
    return (
      <div style={{ display: "flex" }}>
        <Form.Control
          type="number"
          style={{ width: "100px" }}
          className="marginSides-12"
          name={`eq${eqNo}_inp1`}
          value={eqParameters[`eq${eqNo}_inp1`]}
          onChange={handleInputChange}
        />
        <TeX math="x" style={{ fontSize: "22px" }} />
        <Form.Control
          as="select"
          style={{ width: "100px", margin: "0 16px" }}
          name={`eq${eqNo}_sign`}
          value={eqParameters[`eq${eqNo}_sign`]}
          onChange={handleInputChange}
        >
          <option>+</option>
          <option>-</option>
        </Form.Control>
        <Form.Control
          type="number"
          style={{ width: "100px" }}
          className="marginSides-12"
          name={`eq${eqNo}_inp2`}
          value={eqParameters[`eq${eqNo}_inp2`]}
          onChange={handleInputChange}
        />
        <TeX math="y=" style={{ fontSize: "22px" }} />
        <Form.Control
          type="number"
          style={{ width: "100px" }}
          className="marginSides-12"
          name={`eq${eqNo}_inp3`}
          value={eqParameters[`eq${eqNo}_inp3`]}
          onChange={handleInputChange}
        />
      </div>
    );
  }

  return (
    <Container>
      <h2 className="centerContentHorizontal marginTop-12">
        Interseccion entre 2 rectas
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
      <div style={{ margin: "3%" }}>
        <Form
          onSubmit={
            eqSelected == eqTypes[0].value ? onSubmitSlope : onSubmitGeneral
          }
        >
          <ul>
            <li style={{ listStyle: "none" }} className="marginTop-12">
              {eqSelected === eqTypes[0].value
                ? renderSlopeEq(1)
                : renderGeneralEq(1)}
            </li>
            <li style={{ listStyle: "none" }} className="marginTop-12">
              {eqSelected === eqTypes[0].value
                ? renderSlopeEq(2)
                : renderGeneralEq(2)}
            </li>
          </ul>
          <Button
            variant="outline-dark"
            className="marginResponsive"
            style={{ margin: "12px" }}
            type="submit"
          >
            Calcular
          </Button>
        </Form>
        {data !== null && Object.keys(data).length > 0 ? (
          <canvas
            id="plotChartInt"
            style={{ width: "450px", margin: "24px 0" }}
          ></canvas>
        ) : null}
      </div>
    </Container>
  );
};

export default CalcIntRect;
