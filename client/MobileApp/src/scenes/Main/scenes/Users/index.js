import React, { Component, PropTypes } from 'react';
import {
	StyleSheet
} from 'react-native';
import {
	Container,
	Header,
	Title,
	Content,
	Icon,
	Button,
	Body,
	Footer, FooterTab,
	List,
	ListItem,
	Text,
	Spinner,
	View,
	H1,
	H2,
	H3
} from 'native-base';
import Chart from 'react-native-chart';
import TimerMixin from 'react-timer-mixin';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as session from 'MobileApp/src/services/session';
import * as usersActionCreators from 'MobileApp/src/data/users/actions';
import * as usersSelectors from 'MobileApp/src/data/users/selectors';

function jsonToMap(jsonStr) {
    return new Map(JSON.parse(jsonStr));
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'white',
	},
	chart: {
		flex: 1,
		marginTop: 50,
		width: 300,
        height: 275
   	},
	buttonSet: {
		flex: 1,
		marginBottom: 10,
		justifyContent: 'flex-end',
		flexDirection: 'row'
	},
	button: {
		width: 60,
	    alignSelf: 'flex-end',  
		marginRight: 5,
		justifyContent: 'center',
		backgroundColor: 'blue'
	}
});

// num data
// https://io.adafruit.com/api/v2/weaVaer/feeds/temperature/data?x-aio-key=2c6428ac510246478134b64db43355df&limit=1000
// last data
// https://io.adafruit.com/api/v2/weaVaer/feeds/temperature/data/last?x-aio-key=2c6428ac510246478134b64db43355df
const adaFruit = {
	url: 'https://io.adafruit.com/api/v2/',
	paths: {
		tempAll: '/feeds/temperature/data',
		tempLast: '/feeds/temperature/data/last',	
	},
	name: 'weaVaer',
	token: '2c6428ac510246478134b64db43355df',
	limit: 100,
	setOfValuesURL: '',
	lastValueURL: ''
} 

const renderList = () => {
	const items = usersSelectors.getAll();
	if (items.length === 0) {
		return (
			<Spinner size="small" color="#000000" />
		);
	}

	return (
			<List>
				{items.map(item => (
					<ListItem key={item.id}>
						<Text>{item.firstName}</Text>
						<Text note>{item.email}</Text>
					</ListItem>
				))}
			</List>
	);
};

const buttons = () => {
	return (
			<Container>
				<View style={styles.buttonSet}>
						<Button vertical primary
							style={styles.button}
							onPress={() => adaFruit.limit = 10}
						>
							10
						</Button>

						<Button vertical primary 
							style={styles.button}
							onPress={() => adaFruit.limit = 50}
						>
							50
						</Button>

						<Button vertical primary
							style={styles.button}
							onPress={() => adaFruit.limit = 100}
						>
							100
						</Button>

						<Button vertical primary
							style={styles.button}
							onPress={() => adaFruit.limit = 500}
						>
							500
						</Button>

						<Button vertical primary
							style={styles.button}
							onPress={() => adaFruit.limit = 1000}
						>
							1000
						</Button>
			</View>
		</Container>
	);
};

class Users extends Component {
  	mixins = [TimerMixin]

	static propTypes = {
		navigator: PropTypes.shape({
			getCurrentRoutes: PropTypes.func,
			jumpTo: PropTypes.func,
		}),
		actions: PropTypes.shape({
			users: PropTypes.object,
		}),
		services: PropTypes.shape({
			routeHistory: PropTypes.object,
		}),
		data: PropTypes.shape({
			users: PropTypes.object,
		}),
	}

	constructor() {
  		super();
		adaFruit.setOfValuesURL = adaFruit.url + adaFruit.name + adaFruit.paths.tempAll + '?x-aio-key=' + adaFruit.token + '&limit=';
		adaFruit.lastValueURL = adaFruit.url + adaFruit.name + adaFruit.paths.tempLast + '?x-aio-key=' + adaFruit.token;
		this.state = {
			items: [], 
			lastItem: [], 
			data: [
				[0, 1],
				[1, 3],
				[3, 7],
				[4, 9],
			]

		};
  	}

  	daFetcher(f) {
		fetch(adaFruit.lastValueURL)
		 	.then(result=>result.json())
			.then(result=>console.log(result))
			.then(lastItem=>this.setState({lastItem}))
		    .catch(function(error) {
			    console.log('There has been a problem with your fetch operation: ' + error.message);
    		});


		fetch(adaFruit.setOfValuesURL + f)
			.then(res => {
				console.log(res);
			});
  	}

  	componentDidMount() {
		this.tryFetch();
	}

  	componentWillMount() {
		this.daFetcher(adaFruit.limit);
	}

	componentDidUpdate() {
		this.tryFetch();
	}

	onPressLogout() {
		session.revoke().then(() => {
			const routeStack = this.props.navigator.getCurrentRoutes();
			this.props.navigator.jumpTo(routeStack[0]);
			this.props.actions.users.empty();
		});
	}

	tryFetch() {
	}

	render() {
		let d = new Date(this.state.lastItem.updated_at);
		return (
			<Container>
				<View style={styles.container}>
					<Header>
						<Button
							onPress={() => this.onPressLogout()}
							transparent
						>
							<Icon name="ios-power" />
						</Button>

						<Title>The Chart</Title>
					</Header>

					<Content style={{flex: 1}}>

						<View style={styles.container}>

							{this.state.items.length ? '' : 
								<Chart
									style={styles.chart}
									data={this.state.data}
									verticalGridStep={5}
									type="line"
									showDataPoint={true} 
								 />
							}
							<H1>
							Actual Temp:
							</H1>
							<H3>
							{this.state.lastItem.value}
							</H3>
							<H3>
							on: {d.getHours()}:{d.getMinutes()}
							</H3>
							<Text>({d.getDay()}.{d.getMonth()}.{d.getFullYear()})</Text>
							<Text>({this.state.lastItem.updated_at})</Text>
							<Text>retrieved {adaFruit.limit} items.</Text>
						</View>

					</Content>
				</View>

				<Footer>
					{buttons()}
				</Footer>

			</Container>
		);
	}
}

export default connect(state => ({
	data: {
		users: state.data.users,
	},
	services: {
		routeHistory: state.services.routeHistory,
	},
}), dispatch => ({
	actions: {
		users: bindActionCreators(usersActionCreators, dispatch),
	},
}))(Users);
