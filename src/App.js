import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import MonacoEditor from "react-monaco-editor";
import Peer from "peerjs";

const editorStyle = {
  textAlign: "left"
};

const idDisplayStyle = {
  padding: "16px"
};

class App extends Component {
  constructor(props) {
    super(props);
    this.peer = undefined;
    this.connection = undefined;
    this.editor = undefined;
    this.state = {
      peerId: ""
    };
  }

  componentDidMount() {
    this.peer = new Peer();
    console.log(this.peer);
    this.peer.on("open", id => {
      this.setState({
        peerId: id
      });
      console.log("ID: " + id);
    });
    this.peer.on('connection', (conn)=>{
      this.connection = conn;
      this.connection.on('data', this.onReceiveChanges);
      this.connection.send(`hello! from ${this.state.peerId}`);
    });
    this.peer.on('error', (err)=>{
      console.log('ERROR', err);
    });
  }
  
  onReceiveChanges(data){
    console.log(data);
  }

  connect(){
    console.log(this.refs.idinput.value);
    this.connection = this.peer.connect(this.refs.idinput.value);
    this.connection.on('open', ()=>{
      this.connection.on('data', this.onReceiveChanges);
      this.connection.send(`hello! from ${this.state.peerId}`);
    });
    
  }

  editorDidMount(editor, monaco) {
    // editor
    // this.editor = editor;
    // this.mMonaco = monaco;
  }

  onChange(newValue, event) {
    console.log("onChange", newValue, event);
    console.log(this.connection);
    this.connection.send(JSON.stringify(event));
  }
  render() {
    return (
      <div className="App" style={{ textAlign: "start" }}>
        <div style={idDisplayStyle}>
          <p>Connection ID: {this.state.peerId}</p>
          <input type='text' placeholder='id of room to connect' ref='idinput'></input>
          <button onClick={this.connect.bind(this)}>Connect</button>
        </div>
        <MonacoEditor
          style={editorStyle}
          width="800"
          height="600"
          language="javascript"
          theme="vs-dark"
          // value={code}
          // options={options}
          onChange={this.onChange.bind(this)}
          editorDidMount={this.editorDidMount}
          ref="monaco"
        />
      </div>
    );
  }
}

export default App;
