import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import Qs from 'qs'
import server from '../services/server';

// Only require those which are needed in the current component
import MapComponent from './mapComponent';
import MetricSelectionComponent from './metricSelectionComponent';
import MetricStatisticsComponent from './metricStatisticsComponent';

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

        this.apiEndpoints = {
            crime: this.fetchCrimeData,
            // income: this.notImplemented,
            // commute: this.notImplemented
        }

        this.state = {
            metricLabel: '',
            metricName: '',
            metricData: [],
            fetchingData: false,
            metricInfo: '',

        };
    }

    /**
     * Fetches a crime data from backend server. This should probably be moved to another class
     *
     * @param      {<type>}  bounds  The map boundary information
     * @return     {<type>}  { crime information }
     */
    fetchCrimeData = async (bounds) => {
        const response = await server.get('/crime', {
            params: {
                startDate: '2018-04-30',
                endDate: '2018-05-01',
                border: {
                    topRight: {
                        latitude: bounds.bounds.ne.lat,
                        longitude: bounds.bounds.ne.lng,
                    },
                    bottomLeft: {
                        latitude: bounds.bounds.sw.lat,
                        longitude: bounds.bounds.sw.lng,
                    },
                }
            },
            // Prevent axios from encoding our json object incorrectly
            paramsSerializer: function(params) {
                console.log("Response", Qs.stringify(params, {arrayFormat: 'brackets'}));
                return Qs.stringify(params, {arrayFormat: 'brackets'});
            },
        });

        return response;
    }

    toggleFetchingData = () => {
        this.setState({
            fetchingData: !this.state.fetchingData,
        })
    }

    fetchMetricData = async (metricName, bounds) => {

        // Not a good way to handle this, but I'll leave it for now
        if (this.state.fetchingData) {
            console.log('Currently fetching data');
            return null;
        }

        if (!this.apiEndpoints[this.state.metricName]) {
            console.log(`No fetch function for ${this.state.metricName}`);
            return null;
        }
        try {
            this.toggleFetchingData();
            const metricData = await (this.apiEndpoints[this.state.metricName])(bounds);
            this.toggleFetchingData();
            return metricData.data.response;
        } catch(err) {
            this.setState({
                fetchingData: false
            });
            return [];
        }
    }

    onMetricChange = (metricLabel, data) => {
        console.log("Metric change", data.value);
        this.setState({
            metricLabel,
            metricName: data.value,
        });
        
    }

    onMapChange = async (bounds) => {
        console.log("Map Change", bounds);
        const metricData = await this.fetchMetricData(this.state.metricName, bounds);
        if (metricData) {
            this.setState({
                metricData: metricData
            });
        }
    }

    onMarkerClick = (data) => {
        this.setState({
            metricInfo: data
        })
    }

    render() {
        return (
            <div>
                <MetricSelectionComponent onMetricChangeCallback={this.onMetricChange} />
                <Grid columns={2} divided>
                    <Grid.Row>
                        <Grid.Column>
                            <MapComponent onMarkerClickCallback={this.onMarkerClick} onMapChange={this.onMapChange} metricName={this.state.metricName} metricData={this.state.metricData} />
                        </Grid.Column>
                        <Grid.Column>
                            <MetricStatisticsComponent metricStatistics={
                                {
                                    metricLabel: this.state.metricLabel,
                                    metricName: this.state.metricName,
                                    metricData: this.state.metricData,
                                    metricInfo: this.state.metricInfo,
                                }}
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}

export default CodepodsDemographicsComponent;