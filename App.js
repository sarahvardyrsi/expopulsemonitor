import React from "react"
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native"

import Amplify from "aws-amplify"
import { DataStore } from '@aws-amplify/datastore';
import { PulseRead } from './src/models';
import config from './src/aws-exports'

import { v4 as uuidv4 } from 'uuid'; 
import { usb } from 'usb';	

Amplify.configure(config)

export default class App extends React.Component {
	state = {
		name: "",
		pulses: []
	}

	onChangeText = (key, val) => {
		this.setState({ [key]: val })
	}

	addPulse = async () => {
		console.log(usb.getDeviceList());
		const uuidtest = uuidv4();
		await DataStore.save(
			new PulseRead({
			"name": uuidtest,
			"data": "1000101010100101"
		})
	);
	}

	render() {
		return (
			<View style={styles.container}>
				<TouchableOpacity onPress={this.addPulse} style={styles.buttonContainer}>
					<Text style={styles.buttonText}>Start pulse read +</Text>
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