import React from "react"
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native"

import Amplify from "aws-amplify"
import { DataStore } from '@aws-amplify/datastore';
import { PulseRead } from './src/models';
import config from './src/aws-exports'
import { v4 as uuidv4 } from 'uuid'; 
import { w3cwebsocket as W3CWebSocket } from "websocket";
//import { SerialPort } from 'serialport';

//import { SerialPort, Readline } from "serialport";
//import { Readline } from '@serialport/parser-readline';
import SerialPortAPI from 'react-native-serial-port-api';
//import {usb} from 'usb';
//import SerialPort from "serialport";
//import { SerialPort } from 'serialport';
//var usb = require('usb')
/*
const SerialPort = require('serialport')
const port = new SerialPort('/dev/tty-usbserial1', {
  baudRate: 9600
})*/

// Read data that is available but keep the stream in "paused mode"
/*port.on('readable', function () {
  console.log('Data:', port.read())
})

// Switches the port into "flowing mode"
port.on('data', function (data) {
  console.log('Data:', data)
})

// Pipe the data into another stream (like a parser or standard out)
const lineStream = port.pipe(new Readline())*/

Amplify.configure(config)

var client = new W3CWebSocket('ws://localhost:8080/', 'echo-protocol');


export default class App extends React.Component {
	state = {
		name: "",
		pulses: [],
		echo: ''
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
		console.log('You getting data');
		const portpath = 'USB\\VID_2341&amp;PID_0043\\850363135303510131C2';
		console.log(portpath);
		try {
			const serialPort = await SerialPortAPI.open(portpath, { baudRate: 9600 });
			// subscribe received data
			const sub = serialPort.onReceived(buff => {
				console.log(buff.toString('hex').toUpperCase());
			})
			// close
			serialPort.close();
	} catch (err) {
		console.log('could not get port ' + err);
	}
	}

	componentDidMount() {
		client.onopen = function() {
    console.log('WebSocket Client Connected');

      function sendNumber() {
        if (client.readyState === client.OPEN) {
            var number = Math.round(Math.random() * 0xFFFFFF);
            client.send(number.toString());
            setTimeout(sendNumber, 1000);
        }
      }
      sendNumber();
    };

    client.onclose = function() {
      console.log('echo-protocol Client Closed');
    };

    client.onmessage = function(e) {
        if (typeof e.data === 'string') {
          console.log("Received: '" + e.data + "'");
        }
    };

		var socket = new WebSocket('wss://echo.websocket.org/');

		socket.onopen = () => socket.send(new Date().toGMTString());

		socket.onmessage = ({data}) => {
				console.log(data);

				this.setState({echo: data});

				setTimeout(() => {
						socket.send(new Date().toGMTString());
				}, 3000);
		}
}

	render() {
		return (
			<View style={styles.container}>
				<TouchableOpacity onPress={this.addPulse} style={styles.buttonContainer}>
					<Text style={styles.buttonText}>Start pulse read +</Text>
				</TouchableOpacity>
				<Text>websocket echo: {this.state.echo}</Text>
				<TouchableOpacity onPress={this.getPulseMonitorData} style={styles.buttonContainer}>
					<Text style={styles.buttonText}>Get Pulse Data +</Text>
				</TouchableOpacity>
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