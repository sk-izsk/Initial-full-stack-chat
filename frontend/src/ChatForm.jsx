import React, { Component } from "react";
import { connect } from "react-redux";

class UnconnectedChatForm extends Component {
  constructor(props) {
    super(props);
    this.state = { message: "", delu: "" };
  } // 1
  handleMessageChange = event => {
    console.log("new message", event.target.value);
    this.setState({ message: event.target.value });
  };

  delUser = event => {
    console.log("delu", event.target.value);
    this.setState({ delu: event.target.value });
  };

  deleteUser = event => {
    event.preventDefault();
    console.log("state det", this.state.delu);
    let dtemp = this.state.delu;
    console.log("dtemp", dtemp);
    let data = new FormData();
    data.append("del", dtemp);
    console.log("frontend data", data);
    fetch("http://localhost:4000/deleteuser", {
      method: "POST",
      body: data,
      credentials: "include"
    });
  };
  handleSubmit = event => {
    event.preventDefault();
    console.log("form submitted");
    let data = new FormData();

    data.append("msg", this.state.message);
    console.log("cdata", data);
    fetch("http://localhost:4000/newmessage", {
      method: "POST",
      body: data,
      credentials: "include"
    });
  };
  logOut = () => {
    let data = new FormData();
    data.append("msg", this.state.message);
    fetch("http://localhost:4000/logout", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    this.props.dispatch({
      type: "login-unsuccess"
    });
  };
  delete = evt => {
    evt.preventDefault();
    let data = new FormData();
    data.append("msg", this.state.message);
    fetch("http://localhost:4000/delete", {
      method: "POST",
      body: data,
      credentials: "include"
    });
  };

  render = () => {
    // if (this.props.message[username] === "admin") {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input onChange={this.handleMessageChange} type="text" />
          <input type="submit" />
          <button onClick={this.logOut}>logout</button>
        </form>
        <form onSubmit={this.delete}>
          <input type="submit" value="delete" />
        </form>
        {this.props.admin && (
          <form onSubmit={this.deleteUser}>
            <input type="text" onChange={this.delUser} />
            <input type="submit" value="delete user" />
          </form>
        )}
      </div>
    );
    // } else {
    //   return (
    //     <div>
    //       <form onSubmit={this.handleSubmit}>
    //         <input onChange={this.handleMessageChange} type="text" />
    //         <input type="submit" />
    //         <button onClick={this.logOut}>logout</button>
    //       </form>
    //       <form onSubmit={this.delete}>
    //         <input type="submit" value="delete" />
    //       </form>
    //     </div>
    //   );
    // }
  };
}
let mapStateToProps = state => {
  return {
    lgin: state.loggedIn,
    activeUser: state.active,
    message: state.message,
    admin: state.admin
  };
};

let ChatForm = connect(mapStateToProps)(UnconnectedChatForm);
export default ChatForm;
