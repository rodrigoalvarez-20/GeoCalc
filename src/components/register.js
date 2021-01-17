import axios from "axios";
import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/logo.png";
import XMLParser from "react-xml-parser";

const Register = ({ history }) => {
  const [isLoding, switchLoading] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    const txtName = e.target[0].value;
    const txtLastName = e.target[1].value;
    const txtEmail = e.target[2].value;
    const txtPwd = e.target[3].value;
    switchLoading(true);
    const data = new URLSearchParams();

    data.append("email", txtEmail);
    data.append("name", txtName);
    data.append("lastName", txtLastName);
    data.append("password", txtPwd);

    axios({
      url: "http://localhost:8080/GeoCalcApi/user",
      method: "POST",
      data: data,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
      .then((response) => {
        const xml = new XMLParser().parseFromString(response.data);
        if (xml.name === "error") toast.error(xml.value);
        else toast.success(xml.value);
      })
      .catch((error) => {
        console.error(error.message);
        toast.error("Ha ocurrido un error al hacer la request");
      })
      .finally(() => switchLoading(false));
  };

  const goBack = () => {
    history.replace("/GeoCalcApi");
  };

  return (
    <Container className="centerContentHorizontal alignMiddleHV marginTop-12">
      <Row>
        <Col xs={12} md={12}>
          <h2>Registro de usuario</h2>
        </Col>
        <Col xs={12} md={12}>
          <img src={logo} width="120" height="120x" />
        </Col>
        <Form
          onSubmit={onSubmit}
          style={{ width: "80%", margin: "auto", marginTop: "4%" }}
        >
          <Row>
            <Col xs={12} md={6}>
              <Form.Group style={{ textAlign: "start" }}>
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Jane"
                  name="txtName"
                  required
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group style={{ textAlign: "start" }}>
                <Form.Label>Apellidos</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Doe"
                  name="txtLastName"
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={6}>
              <Form.Group style={{ textAlign: "start" }}>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  required
                  type="email"
                  placeholder="jane@example.com"
                  name="txtEmail"
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group style={{ textAlign: "start" }}>
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  required
                  type="password"
                  placeholder="*********"
                  name="txtPwd"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={6} className="centerContentHorizontal">
              {isLoding ? (
                <Spinner animation="grow" variant="dark" />
              ) : (
                <Button
                  style={{ width: "100%" }}
                  className="marginTop-12"
                  variant="primary"
                  type="submit"
                >
                  Registrarse
                </Button>
              )}
            </Col>
            <Col xs={12} md={6}>
              <Button
                onClick={goBack}
                style={{ width: "100%" }}
                className="marginTop-12"
                variant="secondary"
                type="button"
              >
                Regresar
              </Button>
            </Col>
          </Row>
        </Form>
      </Row>
    </Container>
  );
};

export default withRouter(Register);
