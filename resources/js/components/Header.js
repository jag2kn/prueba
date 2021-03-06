import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import * as actions from "../store/actions";

class Header extends Component {
  handleLogout = e => {
    e.preventDefault();
    this.props.dispatch(actions.authLogout());
  };

  render() {
    return (
      <header className="d-flex align-items-center justify-content-between">
        <h1 className="logo my-0 font-weight-normal h4">
          <Link to="/">
            <img src="https://lorempixel.com/50/50/cats/?41966"/>
            Gatosoft
          </Link>
        </h1>

        {this.props.isAuthenticated && (
          <div className="navigation d-flex justify-content-end">
            <Nav>
              <NavItem>
                <NavLink tag={Link} to="/">
                  Inicio
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/company">
                  Compañias
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/employee">
                  Empleados
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} onClick={this.handleLogout}>
                  Salir
                </NavLink>
              </NavItem>
            </Nav>
          </div>
        )}
        {!this.props.isAuthenticated && (
          <div className="navigation d-flex justify-content-end">
            <Nav>
              <NavItem>
                <NavLink tag={Link} to="/login">
                  Ingresar
                </NavLink>
              </NavItem>
            </Nav>
          </div>
        )}


      </header>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.Auth.isAuthenticated
});

export default connect(mapStateToProps)(Header);
