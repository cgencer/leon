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
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as session from 'MobileApp/src/services/session';
import * as usersActionCreators from 'MobileApp/src/data/users/actions';
import * as usersSelectors from 'MobileApp/src/data/users/selectors';

function jsonToMap(jsonStr) {
    return new Map(JSON.parse(jsonStr));
}
Date.prototype.getFullMinutes = function () {
   if (this.getMinutes() < 10) {
       return '0' + this.getMinutes();
   }
   return this.getMinutes();
};

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
	limit: 25,
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

class Users extends Component {

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
			.then(lastItem => {
				this.setState({lastItem})
			})
//			.then(result=>console.log(result))
//			.then(lastItem=>this.setState({lastItem}))
		    .catch(function(error) {
			    console.log('There has been a problem with your fetch operation: ' + error.message);
    		});


		const allowed = ['created_at', 'created_epoch', 'value'];
		var newItems = []; 
		fetch(adaFruit.setOfValuesURL + f)
		 	.then(result => result.json())
			.then(items => {
				console.log(Number(items[5].value));
				for (var i = 0; i < items.length; i++) {
					var d = new Date(Number(items[i].created_epoch));
					newItems.push([
						d.getFullMinutes()+':'+d.getSeconds(), 
						Number(items[i].value)
					]);
				}
				this.setState(data => {
			        return { data: newItems };
				});
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
									showXAxisLabels={false} 
									hideHorizontalGridLines={false}
									hideVerticalGridLines={false}
									showGrid={false} 
									yAxisUseDecimal={true} 
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
						</View>

					</Content>
				</View>

				<Footer>
			<Container>
				<View style={styles.buttonSet}>
						<Button vertical primary
							style={styles.button}
							onPress={() => this.daFetcher(10)}>
							10
						</Button>

						<Button vertical primary 
							style={styles.button}
							onPress={() => this.daFetcher(25)}>
							25
						</Button>

						<Button vertical primary
							style={styles.button}
							onPress={() => this.daFetcher(50)}>
							50
						</Button>

						<Button vertical primary
							style={styles.button}
							onPress={() => this.daFetcher(100)}>
							100
						</Button>

						<Button vertical primary
							style={styles.button}
							onPress={() => this.daFetcher(250)}>
							250
						</Button>
			</View>
		</Container>
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
