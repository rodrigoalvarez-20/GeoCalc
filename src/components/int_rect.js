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
  eq1_inp1: 0,
  eq1_inp2: 0,
  eq1_inp3: 0,
  eq1_sign: "+",
  eq2_inp1: 0,
  eq2_inp2: 0,
  eq2_inp3: 0,
  eq2_sign: "+",
};

/**
 * <div>
            <div
              style={{
                height: "430px",
                width: "80%",
                border: "1px solid black",
                margin: "24px auto",
              }}
              className="centerContentHorizontal"
            ></div>
 */

const CalcIntRect = () => {
  const [eqSelected, setEqSelected] = useState(eqTypes[0].value);
  const [eqParameters, setEqParameters] = useState(defParameters);
  const [data, setData] = useState(null);
  const [exList, setExList] = useState([]);
  const [isExample, setIsExample] = useState(false);

  useEffect(() => {
    /* axios({
      method: "GET",
      url: "http://localhost:8080/GeoCalcApi/Rectas?type=rectas",
    })
      .then((response) => {
        const xmlData = new XMLParser().parseFromString(response.data);
        if (xmlData.name === "error") toast.error(xmlData.value);
        else {
          const items = xmlData.children;
          var exItems = [];
          items.forEach((item) => {
            const { id, inp1, inp2, inp3, type, sign } = item.attributes;
            const { value } = item;
            exItems.push({
              id: Number(id),
              inp1: Number(inp1),
              inp2: Number(inp2),
              inp3: Number(inp3),
              sign,
              type,
              text: value,
            });
          });
          setExList(exItems);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Ha obtener los ejemplos");
      }); */
  }, []);

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

  const addItem = () => {
    const { inp1, inp2, inp3, sign } = eqParameters;
    const label =
      eqSelected === eqTypes[0].value
        ? `y=${inp1}x${sign}${inp2}`
        : `${inp1}x${sign}${inp2}y=${inp3}`;
    var id = 0;
    exList.forEach((item) => {
      if (Number(item.id > id)) id = Number(item.id);
    });
    const params = new URLSearchParams();
    params.append("id", id + 1);
    params.append("inp1", inp1);
    params.append("inp2", inp2);
    params.append("inp3", inp3);
    params.append("sign", sign);
    params.append("label", label);
    params.append("type", eqSelected);
    params.append("section", "rectas");
    params.append("isForAdd", 1);
    axios({
      method: "PUT",
      url: `http://localhost:8080/GeoCalcApi/Rectas`,
      params: params,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
      .then((response) => {
        const xmlData = new XMLParser().parseFromString(response.data);
        console.info(xmlData);
        if (xmlData.name === "error") toast.error(xmlData.value);
        else {
          toast.success(xmlData.value);
          const newItem = {
            id: Number(id),
            inp1: Number(inp1),
            inp2: Number(inp2),
            inp3: Number(inp3),
            sign,
            type: eqSelected,
            text: label,
          };
          const prevItems = exList;
          prevItems.push(newItem);
          setExList(prevItems);
          setIsExample(true);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Ha ocurrido un error al agregar la ecuacion");
      });
  };

  const updateItem = () => {
    const { inp1, inp2, inp3, sign, id } = eqParameters;
    const label =
      eqSelected === eqTypes[0].value
        ? `y=${inp1}x${sign}${inp2}`
        : `${inp1}x${sign}${inp2}y=${inp3}`;
    const params = new URLSearchParams();
    params.append("id", id);
    params.append("inp1", inp1);
    params.append("inp2", inp2);
    params.append("inp3", inp3);
    params.append("sign", sign);
    params.append("label", label);
    params.append("type", eqSelected);
    params.append("section", "rectas");
    axios({
      method: "PUT",
      url: `http://localhost:8080/GeoCalcApi/Rectas`,
      params: params,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
      .then((response) => {
        const xmlData = new XMLParser().parseFromString(response.data);
        if (xmlData.name === "error") toast.error(xmlData.value);
        else {
          toast.success(xmlData.value);
          const newItem = {
            id: Number(id),
            inp1: Number(inp1),
            inp2: Number(inp2),
            inp3: Number(inp3),
            sign,
            type: eqSelected,
            text: label,
          };
          const updatedItems = [];

          exList.forEach((item) => {
            if (Number(item.id) !== newItem.id) updatedItems.push(item);
            else updatedItems.push(newItem);
          });

          setExList(updatedItems);
          setIsExample(true);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Ha ocurrido un error al agregar la ecuacion");
      });
  };

  const deleteItem = () => {
    const { id } = eqParameters;
    const params = new URLSearchParams();
    params.append("type", "rectas");
    params.append("id", id);
    axios({
      method: "DELETE",
      url: `http://localhost:8080/GeoCalcApi/Rectas`,
      params: params,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
      .then((response) => {
        const xmlData = new XMLParser().parseFromString(response.data);
        if (xmlData.name === "error") toast.error(xmlData.value);
        else {
          toast.success(xmlData.value);
          setExList(exList.filter((item) => item.id !== id));
          setEqSelected({});
          setIsExample(false);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Ha ocurrido un error al resolver la ecuacion");
      });
  };

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

  function onSelectExample(data) {
    setEqSelected(data.type);
    setIsExample(true);
    setEqParameters(data);
  }

  const handleInputChange = (e) => {
    setEqParameters({ ...eqParameters, [e.target.name]: e.target.value });
  };

  function renderEqButtons() {
    return (
      <div style={{ marginBottom: "22px" }}>
        <Button
          variant="outline-success"
          className="marginSides-12 "
          type="button"
          onClick={addItem}
        >
          Guardar
        </Button>
        <Button
          variant="outline-info"
          className="marginSides-12 "
          type="button"
          onClick={updateItem}
          disabled={!isExample}
        >
          Actualizar
        </Button>
        <Button
          variant="outline-danger"
          className="marginSides-12 "
          type="button"
          onClick={deleteItem}
          disabled={!isExample}
        >
          Eliminar
        </Button>
      </div>
    );
  }

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

  function renderExampleList() {
    return (
      <ListGroup className="marginTop-12">
        {exList.map((ex) => {
          return (
            <ListGroup.Item
              key={ex.id}
              action
              onClick={() => onSelectExample(ex)}
            >
              <TeX math={ex.text} style={{ fontSize: "22px" }} />
            </ListGroup.Item>
          );
        })}
      </ListGroup>
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
      {
        //renderEqButtons()
      }
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
