import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import ReeValidate from "ree-validate";
import classNames from "classnames";
import AuthService from "../services";
import ValidateCert from "../components/ValidateCert";

class Home extends Component {
  constructor() {
    super();

    this.validator = new ReeValidate({
      email: "required|email",
      password: "required|min:6"
    });

    this.state = {
      loading: false,
      email: "",
      password: "",
      errors: {},
      response: {
        error: false,
        message: ""
      }
    };
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });

    // If a field has a validation error, we'll clear it when corrected.
    const { errors } = this.state;
    if (name in errors) {
      const validation = this.validator.errors;
      this.validator.validate(name, value).then(() => {
        if (!validation.has(name)) {
          delete errors[name];
          this.setState({ errors });
        }
      });
    }
  };

  handleBlur = e => {
    const { name, value } = e.target;

    // Avoid validation until input has a value.
    if (value === "") {
      return;
    }

    const validation = this.validator.errors;
    this.validator.validate(name, value).then(() => {
      if (validation.has(name)) {
        const { errors } = this.state;
        errors[name] = validation.first(name);
        this.setState({ errors });
      }
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { email, password } = this.state;
    const credentials = {
      email,
      password
    };

    this.validator.validateAll(credentials).then(success => {
      if (success) {
        this.setState({ loading: true });
        this.submit(credentials);
      }
    });
  };

  submit = credentials => {
    this.props.dispatch(AuthService.login(credentials)).catch(err => {
      this.loginForm.reset();
      const errors = Object.values(err.errors);
      errors.join(" ");
      const response = {
        error: true,
        message: errors
      };
      this.setState({ response });
      this.setState({ loading: false });
    });
  };

  render() {
    // If user is already authenticated we redirect to entry location.
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    const { isAuthenticated } = this.props;
    if (isAuthenticated) {
      return <Redirect to={from} />;
    }

    const { response, errors, loading } = this.state;

    return (
      <div>
        <div className="d-flex flex-column flex-md-row align-items-md-center py-5">
          <div className="container">
            <div className="section-about col-lg-12 mb-12 mb-lg-12">
              <img src="/imgs/logo.png"/>
              <h2>Centro de enseñanza automovilistica</h2>
            </div>
            <br/>
            <div className="row">
              <div className="section-validate col-12">
                <ValidateCert />
              </div>
              
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  isAuthenticated: state.Auth.isAuthenticated
});

export default connect(mapStateToProps)(Home);
