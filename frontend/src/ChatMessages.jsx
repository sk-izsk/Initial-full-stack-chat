import React, { Component } from "react";
import { connect } from "react-redux";

class UnconnectedChatMessages extends Component {
  componentDidMount = () => {
    let updater = () => {
      fetch("http://localhost:4000/messages") /* 3 */
        .then(response => {
          return response.text();
        })
        .then(responseBody => {
          console.log("response from messages", responseBody);
          let parsed = JSON.parse(responseBody);
          console.log("parsed", parsed);
          this.props.dispatch({
            type: "set-messages",
            messages: parsed
          });
        });
      fetch("http://localhost:4000/active") /* 3 */
        .then(response => {
          return response.text();
        })
        .then(responseBody => {
          console.log("active users: ", responseBody);
          let parsed = JSON.parse(responseBody);
          console.log("parsed: ", parsed);
          this.props.dispatch({
            type: "active",
            activeUser: parsed
          });
        });
    };
    setInterval(updater, 500);
  };
  render = () => {
    console.log("ASDASDASDASD", this.props.active);
    let msgToElement = e => (
      <li>
        {" "}
        {e.username}:{e.message}:{e.time}{" "}
      </li>
    );
    let activeU = e => {
      console.log(e);
      return <li>{e.name}</li>;
    };
    return (
      <div className="active-user">
        <div>
          <ul>{this.props.messages.map(msgToElement)}</ul>
        </div>
        <div>
          user active
          <ul>{this.props.activeUser.map(activeU)}</ul>
        </div>
      </div>
    );
  };
}
let mapStateToProps = state => {
  return {
    messages: state.msgs,
    activeUser: state.active
  };
};
let Chat = connect(mapStateToProps)(UnconnectedChatMessages);
export default Chat;
