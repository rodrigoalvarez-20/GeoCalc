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
      const { x1, y1, x2, y2 } = eqParameters;
      var xMinValue, xMaxValue, yMinValue, yMaxValue;
      if (Number(x1) < Number(x2)) {
        xMinValue = Number(x1);
        xMaxValue = Number(x2);
      } else {
        xMinValue = Number(x2);
        xMaxValue = Number(x1);
      }
      if (Number(y1) < Number(y2)) {
        yMinValue = Number(y1);
        yMaxValue = Number(y2);
      } else {
        yMinValue = Number(y2);
        yMaxValue = Number(y1);
      }
      var ctx = document.getElementById("plotChartParPerp");
      new Chart(ctx, {
        type: "scatter",
        data: {
          datasets: [
            {
              label: "",
              data: [{ x: data.xMedio, y: data.yMedio }],
              backgroundColor: "blue",
              lineTension: 0.1,
              pointRadius: 12,
              spanGaps: false,
            },
            {
              label: "",
              data: [{ x: eqParameters.x1, y: eqParameters.y1 }],
              backgroundColor: "black",
              lineTension: 0.1,
              pointRadius: 8,
              spanGaps: false,
            },
            {
              label: "",
              data: [{ x: eqParameters.x2, y: eqParameters.y2 }],
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
            text: `Distancia entre puntos: ${data.distancia}`,
          },
          scales: {
            xAxes: [
              {
                ticks: {
                  min: xMinValue - 5,
                  max: xMaxValue + 5,
                },
              },
            ],
            yAxes: [
              {
                ticks: {
                  min: yMinValue - 5,
                  max: yMaxValue + 5,
                },
              },
            ],
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
    params.append("x1", eqParameters.x1);
    params.append("y1", eqParameters.y1);
    params.append("x2", eqParameters.x2);
    params.append("y2", eqParameters.y2);
    /* axios({
      method: "POST",
      url: `http://localhost:8080/GeoCalcApi/Puntos?type=punto_medio`,
      data: params,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
      .then((response) => {
        const xmlData = new XMLParser().parseFromString(response.data);
        const values = xmlData.children;
        const distancia = values[0].value;
        const xMedio = values[1].value;
        const yMedio = values[2].value;
        var yValues = [];

        setData({
          distancia,
          xMedio,
          yMedio,
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error("Ha ocurrido un error al realizar la peticion");
      }); */
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
            id="plotChartParPerp"
            style={{ width: "450px", margin: "24px 0" }}
          ></canvas>
        ) : null}
      </div>
    </Container>
  );
};

export default TwoPointsLine;
