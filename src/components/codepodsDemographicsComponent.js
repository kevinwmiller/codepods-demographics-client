import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import logo from '../logo-main.png';

// Only require those which are needed in the current component
import MapComponent from './mapComponent';
import Metrics from '../metrics/metrics';
import MetricSelectionComponent from './metricSelectionComponent';
import MetricStatisticsComponent from './metricStatisticsComponent';

const metrics = new Metrics();

/**
  * The layout component of Codepods Demographics
  */
class CodepodsDemographicsComponent extends Component {
    /**
    * @constructor
    * @param {object} props
    */
    constructor(props) {
        super(props);

        this.state = {
            metricLabel: '',
            metricName: '',
            metricInfo: [],
        };
    }

    onMetricChange = (metricLabel, data) => {
        console.log("Metric change", data.value);
        if (this.state.metricName) {
            // Remove any existing data
            console.log('Clearing data');
            metrics.clearData(this.state.metricName);
        }
        this.setState({
            metricLabel,
            metricName: data.value,
        });
    }

    onMarkerClick = (data) => {
        console.log("Marker clicked");
        console.log(data);
        this.setState({
            metricInfo: data
        });
    }

    render() {
        return (
            <div>
                <Grid columns={2} divided>
                    <Grid.Row style={{
                        paddingTop: '50px',
                    }}>
                        <Grid.Column>
                            <h2 className="ui header">
                                <img className="ui image" src={logo} alt="logo" />
                                <div className="content">
                                    Codepods Demographics
                                </div>
                            </h2>
                        </Grid.Column>
                        <Grid.Column style={{
                            boxShadow: 'none',
                        }}>
                            <MetricSelectionComponent onMetricChangeCallback={this.onMetricChange} />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <MapComponent metrics={metrics} onMarkerClickCallback={this.onMarkerClick} metricName={this.state.metricName} />
                <MetricStatisticsComponent metricStatistics={
                    {
                        metricLabel: this.state.metricLabel,
                        metricName: this.state.metricName,
                        metricInfo: this.state.metricInfo,
                    }}
                />

            </div>
        );
    }
}

export default CodepodsDemographicsComponent;