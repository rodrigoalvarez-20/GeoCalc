import React, { useState, useEffect } from "react";
import { Container, Form, Button, Col } from "react-bootstrap";
import TeX from "@matejmazur/react-katex";
import { Chart } from "chart.js";
import axios from "axios";

import XMLParser from "react-xml-parser";
import { toast } from "react-toastify";

const defParameters = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
};

const TwoPointsLine = () => {
  const [eqParameters, setEqParameters] = useState(defParameters);
  const [data, setData] = useState({});

  useEffect(() => {
    if (Object.keys(data).length > 0) {
      const { eqPendiente, eqGen, xValues, yValues } = data;
      const { x1, y1, x2, y2 } = eqParameters;
      var ctx = document.getElementById("plotChartTwoPoints");
      new Chart(ctx, {
        type: "line",
        data: {
          labels: xValues,
          datasets: [
            {
              label: "",
              data: yValues,
              lineTension: 0.1,
              fill: false,
              backgroundColor: "#1A237E",
              borderColor: "#FF80AB",
            },
            {
              label: "",
              data: [{ x: x1, y: y1 }],
              backgroundColor: "black",
              lineTension: 0.1,
              pointRadius: 8,
              spanGaps: false,
            },
            {
              label: "",
              data: [{ x: x2, y: y2 }],
              backgroundColor: "black",
              lineTension: 0.1,
              pointRadius: 8,
              spanGaps: false,
            },
          ],
        },
        options: {
          title: {
            display: true,
            text: `Ecuaciones: ${eqPendiente} / ${eqGen}`,
          },
        },
      });
    }
  }, [data]);

  const handleInputChange = (e) => {
    setEqParameters({ ...eqParameters, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setData({});
    const params = new URLSearchParams();
    const { x1, y1, x2, y2 } = eqParameters;
    params.append("x1", x1 ? x1 : "0");
    params.append("y1", y1 ? y1 : "0");
    params.append("x2", x2 ? x2 : "0");
    params.append("y2", y2 ? y2 : "0");
    axios({
      method: "POST",
      url: `http://localhost:8080/GeoCalcApi/Puntos?type=two_points`,
      data: params,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
      .then((response) => {
        const xmlData = new XMLParser().parseFromString(response.data);
        const values = xmlData.children;
        const eqPendiente = values[0].value;
        const eqGen = values[1].value;
        const valores = values[2].children;

        const xValues = [];
        const yValues = [];

        valores.forEach((punto) => {
          const coords = punto.children;
          xValues.push(coords[0].value);
          yValues.push(coords[1].value);
        });

        setData({
          eqPendiente,
          eqGen,
          xValues,
          yValues,
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error("Ha ocurrido un error al realizar la peticion");
      });
  };

  function renderPointFields(noPoint) {
    const xValue = `x${noPoint}`;
    const yValue = `y${noPoint}`;
    return (
      <>
        <TeX math="(" style={{ fontSize: "22px" }} />
        <Form.Control
          type="number"
          style={{ width: "100px" }}
          className="marginSides-12"
          name={xValue}
          value={eqParameters[xValue]}
          onChange={handleInputChange}
        />
        <TeX math="," style={{ fontSize: "22px" }} />
        <Form.Control
          type="number"
          style={{ width: "100px" }}
          className="marginSides-12"
          name={yValue}
          value={eqParameters[yValue]}
          onChange={handleInputChange}
        />
        <TeX math=")" style={{ fontSize: "22px" }} />
      </>
    );
  }

  return (
    <Container>
      <h2 className="centerContentHorizontal marginTop-12">
        Recta que pasa por 2 puntos
      </h2>
      <h5>Introduce los valores de los puntos</h5>
      <div style={{ margin: "2%" }}>
        <Form onSubmit={handleFormSubmit}>
          <div
            style={{ display: "flex", flexWrap: "wrap" }}
            className="marginTop-12"
          >
            <Form.Row style={{ width: "100%", marginTop: "16px" }}>
              <Col style={{ display: "flex" }}>
                <Form.Label style={{ marginRight: "12px", fontSize: "22px" }}>
                  Punto #1:
                </Form.Label>
                {renderPointFields("1")}
              </Col>
            </Form.Row>
            <Form.Row style={{ width: "100%", marginTop: "16px" }}>
              <Col style={{ display: "flex" }}>
                <Form.Label style={{ marginRight: "12px", fontSize: "22px" }}>
                  Punto #2:
                </Form.Label>
                {renderPointFields("2")}
              </Col>
            </Form.Row>
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
            id="plotChartTwoPoints"
            style={{ width: "450px", margin: "24px 0" }}
          ></canvas>
        ) : null}
      </div>
    </Container>
  );
};

export default TwoPointsLine;
