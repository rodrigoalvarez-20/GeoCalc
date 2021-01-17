import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { withCookies } from "react-cookie";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./styles/styles.css";
import "katex/dist/katex.min.css";

import NavBar from "./components/navbar";
import CalcRect from "./components/calc_rect";
import Login from "./components/login";
import Register from "./components/register";
import CalcIntRect from "./components/int_rect";
import ParPerp from "./components/par_perp";
import DistanciaPMedio from "./components/pmedio";
import TwoPointsLine from "./components/two_point";
import PointRect from "./components/point_rect";

const FallBack = () => {
  return (
    <div
      style={{
        margin: "12px",
        textAlign: "center",
      }}
    >
      <h1>Recurso no encontrado</h1>
    </div>
  );
};

const PATH = "/GeoCalcApi";

const App = ({ cookies }) => {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    setIsLogged(
      Object.keys(cookies.cookies).length !== 0 && cookies.cookies.name !== ""
    );
  }, []);

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={8000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover={false}
      />{" "}
      {isLogged ? <NavBar /> : null}
      <Switch>
        <Route exact path={`${PATH}/`}>
          <Login />
        </Route>
        <Route exact path={`${PATH}/register`}>
          <Register />
        </Route>
        <Route exact path={`${PATH}/calc`}>
          <CalcRect />
        </Route>
        <Route exact path={`${PATH}/calc/calculadora-interseccion`}>
          <CalcIntRect />
        </Route>
        <Route exact path={`${PATH}/calc/par-perp`}>
          <ParPerp />
        </Route>
        <Route exact path={`${PATH}/calc/punto-medio`}>
          <DistanciaPMedio />
        </Route>
        <Route exact path={`${PATH}/calc/rect-puntos`}>
          <TwoPointsLine />
        </Route>
        <Route exact path={`${PATH}/calc/dist-rect-punto`}>
          <PointRect />
        </Route>
        <Route path="*">
          <FallBack />
        </Route>
      </Switch>
    </div>
  );
};

export default withCookies(App);
