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
      edit: false,
      courses: [],
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
    Http.get(`${this.apiBase}/course`)
      .then(response => {
        const { data } = response.data;
        console.log("Los cursos son: ", data)
        this.setState({
          courses: data,
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
    this.setState({ "cert": cert });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { cert } = this.state;
    console.log("El certificado es: ", this.state)
    this.addCert(cert);
  };

  addCert = cert => {
    if(cert.course===-1 || cert.course===""){
      alert("Por favor seleccione un curso")
      return
    }
    if(cert.city===-1 || cert.city===""){
      alert("Por favor seleccione una ciudad")
      return
    }
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

  deleteCert(cert){
    if(confirm("¿Está seguro de eliminar el certificado?")){
      Http.delete(this.api+"/"+cert.id)
        .then(({ data }) => {
          this.setState({course: {}, new: false, edit: false}, this.reload())
        })
        .catch((e) => {
          this.setState({
            error: "Sorry, there was an error saving your to do."
          });
        });
    }
  }

  render() {
    const { data, error } = this.state;

    return (
      <div className="container py-5">
        Administración de empresas y empleados

      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.Auth.isAuthenticated,
  user: state.Auth.user
});

export default connect(mapStateToProps)(Dashboard);
