import React from "react"
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native"

import Amplify from "aws-amplify"
import { DataStore } from '@aws-amplify/datastore';
import { PulseRead } from './src/models';
import config from './src/aws-exports'
import { v4 as uuidv4 } from 'uuid'; 
import { w3cwebsocket as W3CWebSocket } from "websocket";

Amplify.configure(config)

var client = new W3CWebSocket('ws://localhost:8999/', 'echo-protocol');
export default class App extends React.Component {
	state = {
		name: "",
		pulses: [],
		echo: '',
		heartbeat: ''
	}

	onChangeText = (key, val) => {
		this.setState({ [key]: val })
	}

	addPulse = async () => {
		const uuidtest = uuidv4();
		await DataStore.save(
			new PulseRead({
			"name": uuidtest,
			"data": "1000101010100101"
		})
	);
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

    client.onmessage = ({data}) => {
      console.log(data);
			this.setState({heartbeat: data});

			setTimeout(() => {
				client.send('heartbeat');
			}, 1000);
    };
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
				<TouchableOpacity onPress={this.addPulse} style={styles.buttonContainer}>
					<Text style={styles.buttonText}>Start pulse read +</Text>
					
				</TouchableOpacity>
				
				<TouchableOpacity onPress={this.getPulseMonitorData} style={styles.buttonContainer}>
					<Text style={styles.buttonText}>Get Pulse Data +</Text>
				</TouchableOpacity>
				<Text>Heartbeat: {this.state.heartbeat}</Text>
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