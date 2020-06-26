import React, { Component } from "react";
import { connect } from "react-redux";
import Http from "../Http";

class User extends Component {
  constructor(props) {
    super(props);

    // Initial state.
    this.state = {
      user: {},
      error: false,
      data: [],
      new: false,
      edit: false,
    };

    // API endpoint.
    this.api = "/api/v1/user";
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
    let  { user }  = this.state
    user[name] = value
    this.setState({ "user": user });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { user } = this.state;
    this.addUser(user);
  };

  addUser = user => {
    Http.post(this.api, user)
      .then(({ data }) => {
        this.setState({user: {}, new: false}, this.reload())
        
      })
      .catch((e) => {
        this.setState({
          error: "Sorry, there was an error saving your to do."
        });
      });
  };

  edit(user){
    this.setState({edit: true, user: user})
    //window.open(`${this.apiBase}/pdf/generate/${code}`, "_blank") //to open new page
    //Http.get(`${this.api}/pdf/generate/${key}`)
  };

  delete(user){
    if(confirm("¿Está seguro de eliminar el usuario?")){
      Http.delete(this.api+"/"+user.id)
        .then(({ data }) => {
          this.setState({user: {}, new: false, edit: false}, this.reload())
          
        })
        .catch((e) => {
          this.setState({
            error: "Sorry, there was an error saving your to do."
          });
        });
    }
  }
  
  updateUser(e){
    e.preventDefault()
    console.log("Actualizando usuario ", this.state.user)
    Http.put(this.api+"/"+this.state.user.id, this.state.user)
      .then(({ data }) => {
        this.setState({user: {}, new: false, edit: false}, this.reload())
        
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
          <button className="btn btn-primary" onClick={()=>{this.setState({new: true, course: {name:"", email:"", password:""}, edit: false})}}>
            Nuevo usuario
          </button>
        }

        {(this.state.new || this.state.edit) &&
          <div className="add-users mb-5">
            <h1 className="text-center mb-4">Generar nuevo usuario</h1>
            <form
              method="post"
              onSubmit={this.handleSubmit}
              ref={el => {
                this.userForm = el;
              }}
            >
              <div className="form-group">
                <label htmlFor="addUser">Nombre</label>
                <div className="d-flex">
                  <input
                    id="addUser"
                    name="name"
                    value={this.state.user.name} 
                    className="form-control mr-3"
                    placeholder="Nombre ..."
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="addUser">Correo</label>
                <div className="d-flex">
                  <input
                    id="addUser"
                    name="email"
                    value={this.state.user.email} 
                    className="form-control mr-3"
                    placeholder="Correo electrónico ..."
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="addUser">Clave</label>
                <div className="d-flex">
                  <input
                    id="addUser"
                    name="password"
                    value={this.state.user.password} 
                    className="form-control mr-3"
                    placeholder="Clave ..."
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                {this.state.new &&
                  <button type="submit" className="btn btn-primary">
                      Crear usuario 
                  </button>
                }
                {this.state.edit &&
                  <button className="btn btn-primary" onClick={(e)=>{this.updateUser(e)}}>
                      Actualizar usuario 
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

        <div className="users">
          <h1 className="text-center mb-4">Lista de usuarios</h1>
          <table className="table table-striped">
            <tbody>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Operaciones</th>
              </tr>
              {data.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={()=>this.edit(user)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={()=>this.delete(user)}
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
  user: state.Auth.user
});

export default connect(mapStateToProps)(User);
