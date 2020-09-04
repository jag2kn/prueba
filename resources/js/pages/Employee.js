import React, { Component } from "react";
import { connect } from "react-redux";
import Http from "../Http";

class Employee extends Component {
  constructor(props) {
    super(props);

    // Initial state.
    this.state = {
      employee: {},
      error: false,
      data: [],
      new: false,
      edit: false,
    };

    // API endpoint.
    this.api = "/api/v1/employee";
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
        }, this.reloadCompany());
      })
      .catch(() => {
        this.setState({
          error: "Unable to fetch data."
        });
      });
  }
  
  reloadCompany(){
    console.log("Consultando empresas ")
    Http.get(`${this.apiBase}/company`)
      .then(response => {
      console.log("Las empresas son:  ",  response.data.data)
        const dataCompany = response.data.data;
        this.setState({
          dataCompany,
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
    let  { employee }  = this.state
    employee[name] = value
    this.setState({ "employee": employee });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { employee } = this.state;
    this.addEmployee(employee);
  };

  addEmployee = employee => {
    Http.post(this.api, employee)
      .then(({ data }) => {
        this.setState({employee: {}, new: false}, this.reload())
        
      })
      .catch((e) => {
        this.setState({
          error: "Sorry, there was an error saving your to do."
        });
      });
  };

  edit(employee){
    this.setState({edit: true, employee: employee})
    //window.open(`${this.apiBase}/pdf/generate/${code}`, "_blank") //to open new page
    //Http.get(`${this.api}/pdf/generate/${key}`)
  };

  delete(employee){
    if(confirm("¿Está seguro de eliminar el empresa?")){
      Http.delete(this.api+"/"+employee.id)
        .then(({ data }) => {
          this.setState({employee: {}, new: false, edit: false}, this.reload())
        })
        .catch((e) => {
          this.setState({
            error: "Sorry, there was an error saving your to do."
          });
        });
    }
  }
  
  updateEmployee(e){
    e.preventDefault()
    console.log("Actualizando empresa ", this.state.employee)
    Http.put(this.api+"/"+this.state.employee.id, this.state.employee)
      .then(({ data }) => {
        this.setState({employee: {}, new: false, edit: false}, this.reload())
        
      })
      .catch((e) => {
        this.setState({
          error: "Sorry, there was an error saving your to do."
        });
      });
  }

  render() {
    const { data, error } = this.state;
    
    console.log("data", data)

    return (
      <div className="container py-5">
        {!this.state.new &&
          <button className="btn btn-primary" onClick={()=>{this.setState({new: true, employee: {name:"", description:""}, edit: false})}}>
            Nuevo empleado
          </button>
        }

        {(this.state.new || this.state.edit) &&
          <div className="add-employees mb-5">
            <h1 className="text-center mb-4">Generar nueva empleado</h1>
            <form
              method="post"
              onSubmit={this.handleSubmit}
              ref={el => {
                this.employeeForm = el;
              }}
            >
              <div className="form-group">
                <label htmlFor="addEmployee">Nombre</label>
                <div className="d-flex">
                  <input
                    name="name"
                    value={this.state.employee.name} 
                    className="form-control mr-3"
                    placeholder="Nombre ..."
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="addEmployee">Apellido</label>
                <div className="d-flex">
                  <input
                    name="lastName"
                    value={this.state.employee.lastName} 
                    className="form-control mr-3"
                    placeholder="Apellido ..."
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="addEmail">Correo</label>
                <div className="d-flex">
                  <input
                    name="email"
                    value={this.state.employee.email} 
                    className="form-control mr-3"
                    placeholder="Correo ..."
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="addLogo">Teléfono</label>
                <div className="d-flex">
                  <input
                    name="phone"
                    value={this.state.employee.phone} 
                    className="form-control mr-3"
                    placeholder="Teléfono ..."
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="addWebSite">Empresa</label>
                <div className="d-flex">
                  {this.state.dataCompany &&
                    <select
                      name="company_id"
                      value={this.state.employee.company_id} 
                      className="form-control mr-3"
                      onChange={this.handleChange}
                    >
                      {this.state.dataCompany.map((x, i)=>{
                        console.log("x, i", x, i)
                        return <option key={i} value={x.id}>{x.name}</option>
                      })}
                    </select>
                  }
                  </div>
              </div>
              

              <div className="form-group">
                {this.state.new &&
                  <button type="submit" className="btn btn-primary">
                      Crear empleado
                  </button>
                }
                {this.state.edit &&
                  <button className="btn btn-primary" onClick={(e)=>{this.updateEmployee(e)}}>
                      Actualizar empleado 
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

        <div className="employees">
          <h1 className="text-center mb-4">Lista de empleados</h1>
          <table className="table table-striped">
            <tbody>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Empresa</th>
                <th>Operaciones</th>
              </tr>
              {data.map(employee => (
                <tr key={employee.id}>
                  <td>{employee.name}</td>
                  <td>{employee.lastName}</td>
                  <td>{employee.email}</td>
                  <td>{employee.phone}</td>
                  <td>{employee.company_id}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={()=>this.edit(employee)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={()=>this.delete(employee)}
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
  employee: state.Auth.employee
});

export default connect(mapStateToProps)(Employee);
