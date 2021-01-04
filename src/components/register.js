import React from 'react';
import {withRouter} from 'react-router-dom';

const Register = ({history}) => {
  const onSubmit = (e) => {
    e.preventDefault();
    const txtMat = e.target[0].value;
    const txtPwd = e.target[1].value;
    //Enviar la solicitud al back
  };

  const goBack = () => {
    history.replace('/register');
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
          style={{width: '65%', margin: 'auto', marginTop: '4%'}}
        >
          <Form.Group style={{textAlign: 'start'}}>
            <Form.Label>Matricula</Form.Label>
            <Form.Control
              type="text"
              placeholder="00000"
              name="txtMat"
              required
            />
          </Form.Group>
          <Form.Group style={{textAlign: 'start'}}>
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="*********"
              name="txtPwd"
            />
          </Form.Group>
          <Button
            style={{width: '100%'}}
            className="marginTop-12"
            variant="primary"
            type="submit"
          >
            Registrarse
          </Button>
          <Button
            onClick={goBack}
            style={{width: '100%'}}
            className="marginTop-12"
            variant="secondary"
            type="button"
          >
            Regresar
          </Button>
        </Form>
      </Row>
    </Container>
  );
};

export default withRouter(Register);
