import React, { Component } from "react";
import { connect } from "react-redux";
import Http from "../Http";

class Dashboard extends Component {
  constructor(props) {
    super(props);

    // Initial state.
    this.state = {
      cert: null,
      error: false,
      data: []
    };

    // API endpoint.
    this.api = "/api/v1/cert";
  }

  componentDidMount() {
    Http.get(`${this.api}?status=open`)
      .then(response => {
        const { data } = response.data;
        this.setState({
          data,
          error: false
        });
      })
      .catch(() => {
        this.setState({
          error: "Unable to fetch data."
        });
      });
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { cert } = this.state;
    this.addCert(cert);
  };

  addCert = cert => {
    console.log("Enviando el cert: ", cert)
    Http.post(this.api, { number: cert })
      .then(({ data }) => {
        const newItem = {
          id: data.id,
          number: cert
        };
        const allCerts = [newItem, ...this.state.data];
        this.setState({ data: allCerts, cert: null });
        this.certForm.reset();
      })
      .catch(() => {
        this.setState({
          error: "Sorry, there was an error saving your to do."
        });
      });
  };

  closeCert = e => {
    const { key } = e.target.dataset;
    const { data: certs } = this.state;

    Http.patch(`${this.api}/${key}`, { status: "closed" })
      .then(() => {
        const updatedCerts = certs.filter(
          cert => cert.id !== parseInt(key, 10)
        );
        this.setState({ data: updatedCerts });
      })
      .catch(() => {
        this.setState({
          error: "Sorry, there was an error closing your to do."
        });
      });
  };

  render() {
    const { data, error } = this.state;

    return (
      <div className="container py-5">
        <div className="add-certs mb-5">
          <h1 className="text-center mb-4">Generar nuevo certificado</h1>
          <form
            method="post"
            onSubmit={this.handleSubmit}
            ref={el => {
              this.certForm = el;
            }}
          >
            <div className="form-group">
              <label htmlFor="addCert">Nombres y apellidos</label>
              <div className="d-flex">
                <input
                  id="addCert"
                  name="name"
                  className="form-control mr-3"
                  placeholder="Build a To Do app..."
                  onChange={this.handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="addCert">Número</label>
              <div className="d-flex">
                <input
                  id="addCert"
                  name="number"
                  className="form-control mr-3"
                  placeholder="Build a To Do app..."
                  onChange={this.handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="addCert">Número</label>
              <div className="d-flex">
                <input
                  id="addCert"
                  name="number"
                  className="form-control mr-3"
                  placeholder="Build a To Do app..."
                  onChange={this.handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="addCert">Número</label>
              <div className="d-flex">
                <input
                  id="addCert"
                  name="number"
                  className="form-control mr-3"
                  placeholder="Build a To Do app..."
                  onChange={this.handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="addCert">Número</label>
              <div className="d-flex">
                <input
                  id="addCert"
                  name="number"
                  className="form-control mr-3"
                  placeholder="Build a To Do app..."
                  onChange={this.handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <button type="submit" className="btn btn-primary">
                CREAR
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div className="alert alert-warning" role="alert">
            {error}
          </div>
        )}

        <div className="certs">
          <h1 className="text-center mb-4">Open To Dos</h1>
          <table className="table table-striped">
            <tbody>
              <tr>
                <th>To Do</th>
                <th>Action</th>
              </tr>
              {data.map(cert => (
                <tr key={cert.id}>
                  <td>{cert.number}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={this.closeCert}
                      data-key={cert.id}
                    >
                      Close
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.Auth.isAuthenticated,
  user: state.Auth.user
});

export default connect(mapStateToProps)(Dashboard);
