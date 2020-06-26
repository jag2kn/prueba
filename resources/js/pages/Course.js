import React, { Component } from "react";
import { connect } from "react-redux";
import Http from "../Http";

class Course extends Component {
  constructor(props) {
    super(props);

    // Initial state.
    this.state = {
      course: {},
      error: false,
      data: [],
      new: false,
      edit: false,
    };

    // API endpoint.
    this.api = "/api/v1/course";
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
    let  { course }  = this.state
    course[name] = value
    this.setState({ "course": course });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { course } = this.state;
    this.addCourse(course);
  };

  addCourse = course => {
    console.log("Enviando el course: ", course)
    Http.post(this.api, course)
      .then(({ data }) => {
        this.setState({course: {}, new: false}, this.reload())
        
      })
      .catch((e) => {
        this.setState({
          error: "Sorry, there was an error saving your to do."
        });
      });
  };

  edit(course){
    this.setState({edit: true, course: course})
    //window.open(`${this.apiBase}/pdf/generate/${code}`, "_blank") //to open new page
    //Http.get(`${this.api}/pdf/generate/${key}`)
  };

  delete(course){
    if(confirm("¿Está seguro de eliminar el curso?")){
      Http.delete(this.api+"/"+course.id)
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
  
  updateCourse(e){
    e.preventDefault()
    console.log("Actualizando usuario ", this.state.course)
    Http.put(this.api+"/"+this.state.course.id, this.state.course)
      .then(({ data }) => {
        this.setState({course: {}, new: false, edit: false}, this.reload())
        
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
          <button className="btn btn-primary" onClick={()=>{this.setState({new: true, course: {name:"", description:""}, edit: false})}}>
            Nuevo curso
          </button>
        }

        {(this.state.new || this.state.edit) &&
          <div className="add-courses mb-5">
            <h1 className="text-center mb-4">Generar nuevo curso</h1>
            <form
              method="post"
              onSubmit={this.handleSubmit}
              ref={el => {
                this.courseForm = el;
              }}
            >
              <div className="form-group">
                <label htmlFor="addCourse">Nombre</label>
                <div className="d-flex">
                  <input
                    name="name"
                    value={this.state.course.name} 
                    className="form-control mr-3"
                    placeholder="Nombre ..."
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="addCourse">Descripción</label>
                <div className="d-flex">
                  <input
                    name="description"
                    value={this.state.course.description} 
                    className="form-control mr-3"
                    placeholder="Descripción ..."
                    onChange={this.handleChange}
                  />
                </div>
              </div>


              <div className="form-group">
                {this.state.new &&
                  <button type="submit" className="btn btn-primary">
                      Crear curso
                  </button>
                }
                {this.state.edit &&
                  <button className="btn btn-primary" onClick={(e)=>{this.updateCourse(e)}}>
                      Actualizar curso 
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

        <div className="courses">
          <h1 className="text-center mb-4">Lista de cursos</h1>
          <table className="table table-striped">
            <tbody>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Operaciones</th>
              </tr>
              {data.map(course => (
                <tr key={course.id}>
                  <td>{course.name}</td>
                  <td>{course.description}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={()=>this.edit(course)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={()=>this.delete(course)}
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
  course: state.Auth.course
});

export default connect(mapStateToProps)(Course);
