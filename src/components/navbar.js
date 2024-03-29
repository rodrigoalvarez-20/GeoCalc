import React from "react";
import { Navbar, NavDropdown, Nav } from "react-bootstrap";
import { withCookies } from "react-cookie";
import { Link, withRouter } from "react-router-dom";
import MusicPlayer from "./musicPlayer";

const BASE_ROUTE = "/GeoCalcApi/calc";

const NavBar = ({ cookies, history }) => {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand>
        <Link to={BASE_ROUTE} className="linkForNav">
          GeoCalc
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <NavDropdown title="Rectas" id="dwRectas" className="marginSides-12">
            <NavDropdown.Item>
              <Link to={BASE_ROUTE} className="linkForNav">
                Calculadora de rectas
              </Link>
            </NavDropdown.Item>
            <NavDropdown.Item>
              <Link
                to={`${BASE_ROUTE}/calculadora-interseccion`}
                className="linkForNav"
              >
                Interseccion entre 2 rectas
              </Link>
            </NavDropdown.Item>
            <NavDropdown.Item>
              <Link to={`${BASE_ROUTE}/par-perp`} className="linkForNav">
                Ecuacion de linea paralela y perpendicular
              </Link>
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="Puntos" id="dwPuntos" className="marginSides-12">
            <NavDropdown.Item>
              <Link to={`${BASE_ROUTE}/punto-medio`} className="linkForNav">
                Distancia y punto medio
              </Link>
            </NavDropdown.Item>
            <NavDropdown.Item>
              <Link to={`${BASE_ROUTE}/rect-puntos`} className="linkForNav">
                Recta que pasa por 2 puntos
              </Link>
            </NavDropdown.Item>
            <NavDropdown.Item>
              <Link to={`${BASE_ROUTE}/dist-rect-punto`} className="linkForNav">
                Distancia de un punto a una recta
              </Link>
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
        <Nav>
          <MusicPlayer />
          <Navbar.Text style={{ color: "black" }}>
            {`Ha iniciado sesion como: ${cookies.get("name")} ${cookies.get(
              "lastName"
            )}`}
          </Navbar.Text>
          <Nav.Link
            onClick={() => {
              cookies.set("name", "", { path: "/" });
              cookies.set("lastName", "", { path: "/" });
              window.location.href = "/GeoCalcApi";
            }}
          >
            Cerrar sesion
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default withCookies(withRouter(NavBar));
