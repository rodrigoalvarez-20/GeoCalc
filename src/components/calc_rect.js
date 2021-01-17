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
};

const CalcRect = () => {
  const [eqSelected, setEqSelected] = useState(eqTypes[0].value);
  const [eqParameters, setEqParameters] = useState(defParameters);
  const [data, setData] = useState({});
  const [exList, setExList] = useState([]);
  const [isExample, setIsExample] = useState(false);

  useEffect(() => {
    axios({
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
        toast.error("Ha ocurrido un error al obtener los ejemplos");
      });
  }, []);

  useEffect(() => {
    if (Object.keys(data).length > 0) {
      var ctx = document.getElementById("plotChart");
      new Chart(ctx, {
        type: "line",
        data: {
          labels: data.xValues, //Valores de y
          datasets: [
            {
              label: "",
              data: data.yValues, //Valores de x
              fill: false,
              backgroundColor: "#1A237E",
              borderColor: "#FF80AB",
            },
          ],
        },
        options: {
          title: {
            display: true,
            text:
              eqSelected === "pendiente"
                ? `Ecuacion y = ${eqParameters.inp1}x ${eqParameters.sign} ${eqParameters.inp2}`
                : `Ecuacion ${eqParameters.inp1}x ${eqParameters.sign} ${eqParameters.inp2}y = ${eqParameters.inp3}`,
          },
          scales: {
            yAxes: [
              {
                stacked: true,
              },
            ],
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

  const onSubmitSlope = (e) => {
    e.preventDefault();
    setData({});
    const { inp1, inp2, sign } = eqParameters;
    const params = new URLSearchParams();
    params.append("inp1", inp1 === "" ? "0" : inp1);
    params.append("inp2", inp2 === "" ? "0" : inp2);
    params.append("sign", sign);
    axios({
      method: "POST",
      url: "http://localhost:8080/GeoCalcApi/Rectas?type=rectas",
      data: params,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
      .then((response) => {
        const xmlData = new XMLParser().parseFromString(response.data);
        const values = xmlData.children;
        var yValues = [];
        var xValues = [];
        values.forEach((value) => {
          const eqValues = value.children;
          xValues.push(eqValues[0].value);
          yValues.push(eqValues[1].value);
        });
        setData({ yValues, xValues });
      })
      .catch((error) => {
        console.log(error);
        toast.error("Ha ocurrido un error al resolver la ecuacion");
      });
  };

  const onSubmitGeneral = (e) => {
    e.preventDefault();
    setData({});
    const { inp1, inp2, inp3, sign } = eqParameters;
    const params = new URLSearchParams();
    params.append("inp1", inp1 === "" ? "0" : inp1);
    params.append("inp2", inp2 === "" ? "0" : inp2);
    params.append("inp3", inp3 === "" ? "0" : inp3);
    params.append("eqType", "general");
    params.append("sign", sign);
    axios({
      method: "POST",
      url: "http://localhost:8080/GeoCalcApi/Rectas?type=rectas",
      data: params,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
      .then((response) => {
        const xmlData = new XMLParser().parseFromString(response.data);
        const values = xmlData.children;
        var yValues = [];
        var xValues = [];
        values.forEach((value) => {
          const eqValues = value.children;
          xValues.push(eqValues[0].value);
          yValues.push(eqValues[1].value);
        });
        setData({ yValues, xValues });
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

  function renderSlopeEq() {
    return (
      <Form
        onSubmit={onSubmitSlope}
        style={{ display: "flex", flexWrap: "wrap" }}
      >
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
          onChange={handleInputChange}
          value={eqParameters.sign}
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
        <Button
          variant="outline-dark"
          className="marginSides-12 marginResponsive"
          type="submit"
        >
          Calcular
        </Button>
      </Form>
    );
  }

  function renderGeneralEq() {
    return (
      <Form
        onSubmit={onSubmitGeneral}
        style={{ display: "flex", flexWrap: "wrap" }}
      >
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
          onChange={handleInputChange}
          value={eqParameters.sign}
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
        <Button
          variant="outline-dark"
          className="marginSides-12 marginResponsive"
          type="submit"
        >
          Calcular
        </Button>
      </Form>
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
        Calculadora grafica de rectas
      </h2>
      <div style={{ margin: "3%" }}>
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
        <div className="marginTop-12">
          {renderEqButtons()}
          {eqSelected === eqTypes[0].value
            ? renderSlopeEq()
            : renderGeneralEq()}
        </div>
        {Object.keys(data).length > 0 ? (
          <canvas
            id="plotChart"
            style={{ width: "450px", margin: "24px 0" }}
          ></canvas>
        ) : null}
        <div className="marginTop-12">
          <h3>Ejemplos</h3>
          {renderExampleList()}
        </div>
      </div>
    </Container>
  );
};

export default CalcRect;
