import React, { Component } from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import Http from "../Http";

class Archive extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      data: {},
      apiMore: "",
      moreLoaded: false,
      error: false
    };

    // API Endpoint
    this.api = "/api/v1/cert";
  }

  componentDidMount() {
    Http.get(this.api)
      .then(response => {
        const { data } = response.data;
        const apiMore = response.data.links.next;
        this.setState({
          data,
          apiMore,
          loading: false,
          error: false
        });
      })
      .catch(() => {
        this.setState({
          error: "Unable to fetch data."
        });
      });
  }

  loadMore = () => {
    this.setState({ loading: true });
    Http.get(this.state.apiMore)
      .then(response => {
        const { data } = response.data;
        const apiMore = response.data.links.next;
        const dataMore = this.state.data.concat(data);
        this.setState({
          data: dataMore,
          apiMore,
          loading: false,
          moreLoaded: true,
          error: false
        });
      })
      .catch(() => {
        this.setState({
          error: "Unable to fetch data."
        });
      });
  };

  deleteCert = e => {
    const { key } = e.target.dataset;
    const { data: certs } = this.state;

    Http.delete(`${this.api}/${key}`)
      .then(response => {
        if (response.status === 204) {
          const index = certs.findIndex(
            cert => parseInt(cert.id, 10) === parseInt(key, 10)
          );
          const update = [...certs.slice(0, index), ...certs.slice(index + 1)];
          this.setState({ data: update });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const { loading, error, apiMore } = this.state;
    const certs = Array.from(this.state.data);

    return (
      <div className="container py-5">
        <h1 className="text-center mb-4">To Do Archive</h1>

        {error && (
          <div className="text-center">
            <p>{error}</p>
          </div>
        )}

        <table className="table">
          <tbody>
            <tr>
              <th>Time</th>
              <th>To Do</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
            {certs.map(cert => (
              <tr key={cert.id}>
                <td>{cert.created_at}</td>
                <td>{cert.value}</td>
                <td>{cert.status}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={this.deleteCert}
                    data-key={cert.id}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {apiMore && (
          <div className="text-center">
            <button
              className={classNames("btn btn-primary", {
                "btn-loading": loading
              })}
              onClick={this.loadMore}
            >
              Load More
            </button>
          </div>
        )}

        {apiMore === null && this.state.moreLoaded === true && (
          <div className="text-center">
            <p>Everything loaded.</p>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.Auth.isAuthenticated,
  user: state.Auth.user
});

export default connect(mapStateToProps)(Archive);
