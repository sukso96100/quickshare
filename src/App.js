import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import MonacoEditor from "react-monaco-editor";
import firebase from "firebase";


const editorStyle = {
  textAlign: "left"
};

const idDisplayStyle = {
  padding: "16px"
};

class App extends Component {
  constructor(props) {
    super(props);
    this.room;
    this.lastEditId;
    this.state = {
      roomId: ""
    };
  }

  componentDidMount() {
   let config = {
    apiKey: "AIzaSyCE5zOiQWJ-tD1V3PrC8qBAGCq9MKv5U5E",
    authDomain: "quickshare-13ff5.firebaseapp.com",
    databaseURL: "https://quickshare-13ff5.firebaseio.com",
    projectId: "quickshare-13ff5",
    storageBucket: "quickshare-13ff5.appspot.com",
    messagingSenderId: "637182425263"
  };
  firebase.initializeApp(config);
  // this.db = firebase.database();
  }
  
  onReceiveChanges(data){
    console.log(data);
  }

  connect(){
    let roomkey = this.refs.idinput.value;
    if(roomkey.length <= 0){
      this.room = firebase.database().ref('rooms').push();
      this.room.set({
        users: [],
        edits: []
      });
    }else{
      this.room = firebase.database().ref('rooms').child(roomkey);
    }
    this.setState({
      roomId: this.room.key
    });
    this.room.child('edits').on('child_added', (snapshot)=>{
      let edit = snapshot.val();
      let ch = edit.changes[0];
      console.log(edit);
      if(snapshot.key !== this.lastEditId){
        this.refs.monaco.editor.getModel().applyEdits([{
          forceMoveMarkers: ch.forceMoveMarkers,
          range: ch.range,
          text: ch.text
        }]);
      }
    });
  
  }

  editorDidMount(editor, monaco) {
    // editor
    // this.editor = editor;
    // this.mMonaco = monaco;
  }

  onChange(newValue, event) {
    console.log("onChange", newValue, event);
    let newEdit = this.room.child('edits').push();
    this.lastEditId = newEdit.key;
    newEdit.set(event);
  }
  render() {
    return (
      <div className="App" style={{ textAlign: "start" }}>
        <div style={idDisplayStyle}>
          <p>Connection ID: {this.state.roomId}</p>
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
