import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import * as actions from "../store/actions";
import Http from "../Http";

class ValidateCert extends Component {

  constructor(props) {
    super(props);

    // Initial state.
    this.state = {
      document: "",
      a: "",
      b: "",
      data: [],
    };

    // API endpoint.
    this.api = "/api/v1/cert";
    this.apiBase = "/api/v1";
  }

  componentDidMount() {
    this.setState({
      a:1+parseInt(Math.random()*7), 
      b:1+parseInt(Math.random()*7)
    })
  }


  handleChange(e){
    const { name, value } = e.target;
    let s = this.state
    s[name] = value
    this.setState(s);
  };
  
  validar(){
    if(this.state.a+this.state.b !== parseInt(this.state.result)){
      alert("La operación es incorrecta")
      return
    }
    if(this.state.document === ""){
      alert("Ingrese un documento")
      return
    }
    Http.get(`${this.api}?document=${this.state.document}`)
      .then(response => {
        const { data } = response.data;
        if(data.length===0){
          return alert("No se encontraron registros con ese documento.")
        }
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

  downloadCert(code){
    window.open(`${this.apiBase}/pdf/generate/${code}`, "_blank") //to open new page
    //Http.get(`${this.api}/pdf/generate/${key}`)
  };
  render() {
  
    const { data } = this.state;
    return (
      <div>
        <h3>Validar certificado</h3>
        <div class="row">
          <div className="form-group col-4">
            <label htmlFor="document">Documento</label>
            <div>
              <input
                name="document"
                placeholder="Documento ..."
                required
                  onChange={(e)=>{this.handleChange(e)}}
              />
            </div>
          </div>
          <div className="form-group col-4">
            <label htmlFor="document">Escriba el resultado de: {this.state.a} + {this.state.b}</label>
            <div>
              <input
                  name="result"
                  placeholder="..."
                  required
                  onChange={(e)=>{this.handleChange(e)}}
              />
            </div>
          </div>
          <div className="form-group col-4">
            <label class>&nbsp;</label>
            <div>
              <button className="btn btn-primary" onClick={()=>{this.validar()}}>
                Validar
              </button>
            </div>
          </div>
        </div>
        
        
        {data.length!==0 && 
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
              </tr>
              {data.map(cert => (
                <tr key={cert.id}>
                  <td>{cert.name}</td>
                  <td>{cert.document}</td>
                  <td>{cert.number}</td>
                  <td>{cert.startDate}</td>
                  <td>{cert.endDate}</td>
                  <td>{cert.city}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.Auth.isAuthenticated
});

export default connect(mapStateToProps)(ValidateCert);
