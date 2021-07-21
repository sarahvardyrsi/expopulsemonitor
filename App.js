import React from "react"
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native"

import Amplify from "aws-amplify"
import config from "./aws-exports"

Amplify.configure(config)

export default class App extends React.Component {
	state = {
		name: "",
		todos: []
	}

	onChangeText = (key, val) => {
		this.setState({ [key]: val })
	}

	addTodo = () => {}

	render() {
		return (
			<View style={styles.container}>
				<TextInput
					style={styles.input}
					value={this.state.name}
					onChangeText={val => this.onChangeText("name", val)}
					placeholder='Add a Todo'
				/>
				<TouchableOpacity onPress={this.addTodo} style={styles.buttonContainer}>
					<Text style={styles.buttonText}>Add +</Text>
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