import React, { Component } from "react";
import { connect } from "react-redux";
import Http from "../Http";

class Dashboard extends Component {
  constructor(props) {
    super(props);

    // Initial state.
    this.state = {
      cert: {},
      error: false,
      data: [],
      new: false,
    };

    // API endpoint.
    this.api = "/api/v1/cert";
    this.apiBase = "/api/v1";
  }

  componentDidMount() {
    this.reload();
  }
  
  reload(){
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
    let  { cert }  = this.state
    cert[name] = value
    this.setState({ "cert": cert }, ()=>{console.log("El estado / certificado es ", this.state)});
  };

  handleSubmit = e => {
    e.preventDefault();
    const { cert } = this.state;
    console.log("El certificado es: ", this.state)
    this.addCert(cert);
  };

  addCert = cert => {
    console.log("Enviando el cert: ", cert)
    Http.post(this.api, cert)
      .then(({ data }) => {
        this.setState({cert: {}, new: false}, this.reload())
        
      })
      .catch((e) => {
        this.setState({
          error: "Sorry, there was an error saving your to do."
        });
      });
  };

  downloadCert(code){
    window.open(`${this.apiBase}/pdf/generate/${code}`, "_blank") //to open new page
    //Http.get(`${this.api}/pdf/generate/${key}`)
  };

  render() {
    const { data, error } = this.state;

    return (
      <div className="container py-5">
        {!this.state.new &&
          <button className="btn btn-primary" onClick={()=>{this.setState({new: true})}}>
            Nuevo certificado
          </button>
        }

        {this.state.new &&
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
                    placeholder="Nombre ..."
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="addCert">Documento identidad</label>
                <div className="d-flex">
                  <input
                    id="addCert"
                    name="document"
                    className="form-control mr-3"
                    placeholder="Documento identidad ..."
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="addCert">Consecutivo</label>
                <div className="d-flex">
                  <input
                    id="addCert"
                    name="number"
                    className="form-control mr-3"
                    placeholder="Consecutivo ..."
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="addCert">Fecha inicio</label>
                <div className="d-flex">
                  <input
                    id="addCert"
                    type="date"
                    name="startDate"
                    className="form-control mr-3"
                    placeholder="Fecha de inicio ..."
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="addCert">Fecha final</label>
                <div className="d-flex">
                  <input
                    id="addCert"
                    type="date"
                    name="endDate"
                    className="form-control mr-3"
                    placeholder="Fecha final ..."
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="addCert">Ciudad</label>
                <div className="d-flex">
                  <select
                    id="addCert"
                    name="city"
                    className="form-control mr-3"
                    onChange={this.handleChange}
                  >
                    <option disabled selected>Selecciona una opción</option>
                    <option value="Bogotá">Bogotá</option>
                    <option value="Cali">Cali</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="addCert">Curso</label>
                <div className="d-flex">
                  <select
                    id="addCert"
                    name="course"
                    className="form-control mr-3"
                    onChange={this.handleChange}
                  >
                    <option disabled selected>Selecciona una opción</option>
                    <option value="4959/06-1724/07">CURSO ESPECÍFICO EN TRÁNSITO Y SEGURIDAD VIAL PARA PERSONAL TÉCNICO Y/O AUXILIAR ACOMPAÑANTE DE CARGA EXTRADIMENSIONADA</option>
                  </select>
                </div>
              </div>



              <div className="form-group">
                <button type="submit" className="btn btn-primary">
                  CREAR
                </button>
                <button className="btn btn-danger" onClick={()=>{this.setState({new: false})}}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        }

        {error && (
          <div className="alert alert-warning" role="alert">
            {error}
          </div>
        )}

        <div className="certs">
          <h1 className="text-center mb-4">Lista de certificados</h1>
          <table className="table table-striped">
            <tbody>
              <tr>
                <th>Nombre</th>
                <th>Documento</th>
                <th>Consecutivo</th>
                <th>Fecha inicio</th>
                <th>Fecha fin</th>
                <th>Ciudad</th>
                <th></th>
              </tr>
              {data.map(cert => (
                <tr key={cert.id}>
                  <td>{cert.name}</td>
                  <td>{cert.document}</td>
                  <td>{cert.number}</td>
                  <td>{cert.startDate}</td>
                  <td>{cert.endDate}</td>
                  <td>{cert.city}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={()=>this.downloadCert(cert.code)}
                      data-key={cert.code}
                    >
                      Descargar
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
