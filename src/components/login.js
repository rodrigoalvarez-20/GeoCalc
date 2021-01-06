import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/logo.png";
import axios from "axios";
import XMLParser from "react-xml-parser";
import { withCookies } from "react-cookie";

const Login = ({ history, cookies }) => {
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (cookies.get("name")) history.replace("/calc");
  });

  const onSubmit = (e) => {
    e.preventDefault();
    const txtEmail = e.target[0].value;
    const txtPwd = e.target[1].value;

    const data = new URLSearchParams();
    data.append("email", txtEmail);
    data.append("password", txtPwd);
    setLoading(true);

    axios({
      url: "http://localhost:8080/GeoCalcApi/user",
      method: "GET",
      params: data,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
      .then((response) => {
        const xml = new XMLParser().parseFromString(response.data);
        if (xml.name === "error") toast.error(xml.value);
        else {
          toast.success(xml.children[0].value);
          cookies.set("name", xml.children[1].value, { path: "/" });
          cookies.set("lastName", xml.children[2].value, { path: "/" });
          window.location.href = "/";
        }
      })
      .catch((error) => {
        console.error(error.message);
        toast.error("Ha ocurrido un error al iniciar sesion");
      })
      .finally(() => setLoading(false));
  };

  const sendRegister = () => {
    history.push("/register");
  };

  return (
    <Container className="centerContentHorizontal alignMiddleHV marginTop-12">
      <Row>
        <Col xs={12} md={12}>
          <h2>Inicio de Sesion</h2>
        </Col>
        <Col xs={12} md={12}>
          <img src={logo} width="120" height="120x" />
        </Col>
        <Form
          onSubmit={onSubmit}
          style={{ width: "65%", margin: "auto", marginTop: "4%" }}
        >
          <Form.Group style={{ textAlign: "start" }}>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              placeholder="jane@example.com"
              name="txtEmail"
              required
            />
          </Form.Group>
          <Form.Group style={{ textAlign: "start" }}>
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="*********"
              name="txtPwd"
            />
          </Form.Group>
          <Button
            style={{ width: "100%" }}
            className="marginTop-12"
            variant="primary"
            type="submit"
          >
            {isLoading ? <Spinner animation="grow" /> : "Iniciar sesion"}
          </Button>
          <Button
            onClick={sendRegister}
            style={{ width: "100%" }}
            className="marginTop-12"
            variant="secondary"
            type="button"
          >
            Registrarse
          </Button>
        </Form>
      </Row>
    </Container>
  );
};

export default withCookies(withRouter(Login));
