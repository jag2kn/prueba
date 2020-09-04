import React, { Component } from "react";
import { connect } from "react-redux";
import Http from "../Http";

class Company extends Component {
  constructor(props) {
    super(props);

    // Initial state.
    this.state = {
      company: {},
      error: false,
      data: [],
      new: false,
      edit: false,
    };

    // API endpoint.
    this.api = "/api/v1/company";
    this.apiBase = "/api/v1";
  }

  componentDidMount() {
    this.reload();
  }
  
  reload(){
    Http.get(`${this.api}`)
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
    let  { company }  = this.state
    company[name] = value
    this.setState({ "company": company });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { company } = this.state;
    this.addCompany(company);
  };

  addCompany = company => {
    Http.post(this.api, company)
      .then(({ data }) => {
        this.setState({company: {}, new: false}, this.reload())
        
      })
      .catch((e) => {
        this.setState({
          error: "Sorry, there was an error saving your to do."
        });
      });
  };

  edit(company){
    this.setState({edit: true, company: company})
    //window.open(`${this.apiBase}/pdf/generate/${code}`, "_blank") //to open new page
    //Http.get(`${this.api}/pdf/generate/${key}`)
  };

  delete(company){
    if(confirm("¿Está seguro de eliminar el empresa?")){
      Http.delete(this.api+"/"+company.id)
        .then(({ data }) => {
          this.setState({company: {}, new: false, edit: false}, this.reload())
        })
        .catch((e) => {
          this.setState({
            error: "Sorry, there was an error saving your to do."
          });
        });
    }
  }
  
  updateCompany(e){
    e.preventDefault()
    console.log("Actualizando empresa ", this.state.company)
    Http.put(this.api+"/"+this.state.company.id, this.state.company)
      .then(({ data }) => {
        this.setState({company: {}, new: false, edit: false}, this.reload())
        
      })
      .catch((e) => {
        this.setState({
          error: "Sorry, there was an error saving your to do."
        });
      });
  }

  render() {
    const { data, error } = this.state;

    return (
      <div className="container py-5">
        {!this.state.new &&
          <button className="btn btn-primary" onClick={()=>{this.setState({new: true, company: {name:"", description:""}, edit: false})}}>
            Nuevo empresa
          </button>
        }

        {(this.state.new || this.state.edit) &&
          <div className="add-companys mb-5">
            <h1 className="text-center mb-4">Generar nueva empresa</h1>
            <form
              method="post"
              onSubmit={this.handleSubmit}
              ref={el => {
                this.companyForm = el;
              }}
            >
              <div className="form-group">
                <label htmlFor="addCompany">Nombre</label>
                <div className="d-flex">
                  <input
                    name="name"
                    value={this.state.company.name} 
                    className="form-control mr-3"
                    placeholder="Nombre ..."
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="addEmail">Correo</label>
                <div className="d-flex">
                  <input
                    name="email"
                    value={this.state.company.email} 
                    className="form-control mr-3"
                    placeholder="Correo ..."
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="addLogo">Logo</label>
                <div className="d-flex">
                  <input
                    name="logo"
                    value={this.state.company.logo} 
                    className="form-control mr-3"
                    placeholder="Logo ..."
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="addWebSite">Sitio web</label>
                <div className="d-flex">
                  <input
                    name="website"
                    value={this.state.company.website} 
                    className="form-control mr-3"
                    placeholder="Sitio web ..."
                    onChange={this.handleChange}
                  />
                </div>
              </div>


              <div className="form-group">
                {this.state.new &&
                  <button type="submit" className="btn btn-primary">
                      Crear empresa
                  </button>
                }
                {this.state.edit &&
                  <button className="btn btn-primary" onClick={(e)=>{this.updateCompany(e)}}>
                      Actualizar empresa 
                  </button>
                }
                <button className="btn btn-warning" onClick={()=>{this.setState({new: false, edit: false})}}>
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

        <div className="companys">
          <h1 className="text-center mb-4">Lista de empresas</h1>
          <table className="table table-striped">
            <tbody>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Logo</th>
                <th>Sitio web</th>
                <th>Operaciones</th>
              </tr>
              {data.map(company => (
                <tr key={company.id}>
                  <td>{company.name}</td>
                  <td>{company.email}</td>
                  <td><img src={company.logo}/></td>
                  <td>{company.website}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={()=>this.edit(company)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={()=>this.delete(company)}
                    >
                      Borrar
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
  company: state.Auth.company
});

export default connect(mapStateToProps)(Company);
