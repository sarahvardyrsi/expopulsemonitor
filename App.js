import React, { useRef, useEffect } from "react"
import { Animated, StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native"
import Amplify from "aws-amplify"
import { DataStore } from '@aws-amplify/datastore';
import { PulseRead } from './src/models';
import config from './src/aws-exports'
import { v4 as uuidv4 } from 'uuid'; 
import { w3cwebsocket as W3CWebSocket } from "websocket";
import * as Animatable from 'react-native-animatable';

Amplify.configure(config)

var client = new W3CWebSocket('ws://localhost:8999/', 'echo-protocol');

var pulses = [];
export default class App extends React.Component {
	state = {
		name: "",
		echo: '',
		heartbeat: '', 
		recording: false
	}


	onChangeText = (key, val) => {
		this.setState({ [key]: val })
	}

	recordPulse = async () => {
		this.setState({recording: true})
		setTimeout(() => {
			this.setState({recording: false});
		}, 30000);
		
    client.onmessage = ({data}) => {
      console.log(data);
			this.setState({heartbeat: data});
			this.addPulse(data);
    };
	}

	addPulse = async (beat) => {
		pulses.push(beat);
		console.log('number of pulses ' + pulses.length);
		if (pulses.length > 1 && this.state.recording == false) {
		const uuidtest = uuidv4();
			await DataStore.save(
				new PulseRead({
				"name": uuidtest,
				"data": pulses.toString()
			})
		);
		}
	}

	getPulseMonitorData = async () => {
		console.log('Lets get some data from that socket');
	
	}

	componentDidMount() {
		client.onopen = function() {
    	console.log('WebSocket Client Connected');
    };

    client.onclose = function() {
      console.log('echo-protocol Client Closed');
    };

		/*client.onmessage = ({data}) => {
      console.log(data);
			//pulses.push(data);
			this.setState({heartbeat: data});
    };*/
		var socket = new WebSocket('wss://echo.websocket.org/');

		socket.onopen = () => socket.send(new Date().toGMTString());

		socket.onmessage = ({data}) => {
				this.setState({echo: data});
				setTimeout(() => {
						socket.send(new Date().toGMTString());
				}, 1000);
		}
}

	render() {
		return (
			<View style={styles.container}>
				<Text>Date: {this.state.echo}</Text>
				{ this.state.recording ? null : <TouchableOpacity onPress={this.recordPulse} style={styles.buttonContainer}>
					<Text style={styles.buttonText}>Start pulse recording +</Text> ? 
				</TouchableOpacity> }
				{ this.state.recording ? 	<Animatable.Text 
					animation="pulse" 
					easing="ease-in" 
					iterationCount="infinite" 
					style={{ textAlign: 'center' }}>
				❤️ Recording
				</Animatable.Text> : null }
				<TouchableOpacity onPress={this.getPulseMonitorData} style={styles.buttonContainer}>
					<Text style={styles.buttonText}>Get Pulse Data +</Text>
				</TouchableOpacity>
				<Text>Your BPM {this.state.heartbeat}</Text>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		paddingHorizontal: 10,
		paddingTop: 50
	},
	input: {
		height: 50,
		borderBottomWidth: 2,
		borderBottomColor: "blue",
		marginVertical: 10
	},
	buttonContainer: {
		backgroundColor: "#34495e",
		marginTop: 10,
		marginBottom: 10,
		padding: 10,
		borderRadius: 5,
		alignItems: "center"
	},
	buttonText: {
		color: "#fff",
		fontSize: 24
	}
})