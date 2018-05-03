import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import server from '../services/server';
import GoogleMapReact from 'google-map-react';

const config = require('../config');

const MetricLabel = ({ metricName }) => <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{metricName}</div>;
MetricLabel.propTypes = {
    metricName: PropTypes.string.isRequired,
};

/**
  * A wrapper around a GoogleMap component that controls the rendering of different metric data
  * @reactProps {string} metricName - The metric to display
  */
class MapComponent extends Component {

    constructor() {
        super();
        this.metricProcessors = {
            crime: this.processCrime,
            income: this.notImplemented,
            commute: this.notImplemented
        }
    }

    processCrime = (data) => {
        if (!data) {
            return [];
        }
        let crimes = []
        for (let incident of data) {
            for (let crime of incident.crimes) {
                crimes.push({
                    lat: parseFloat(crime.location.latitude),
                    lng: parseFloat(crime.location.longitude),
                });
            }
        }
        if (crimes.length > 0) {
            console.log(crimes[0].lat, crimes[0].lng)
        }
        return [
            {lat: 39.3278, lng: -76.6181},
            {lat: 39.103969, lng: -76.843785},
            {lat: 39.0957812, lng: -76.84830029999999}
        ]
        return [
            {lat: crimes[0].lat, lng: crimes[0].lng},
            {lat: crimes[1].lat, lng: crimes[1].lng},
            {lat: crimes[2].lat, lng: crimes[2].lng}
        ]
        return crimes;
    }

    notImplemented(data) {
        return [];
    }

    getHeatmapData = (metricName, data) => {
        let heatmapData = [];
        // if (metricName in this.metricProcessors) {
            try {
                console.log('setting heatmap');
                heatmapData = {
                    // 
                    positions: this.processCrime(data),
                };
                console.log(heatmapData);
            } catch (err) {
                console.log('aaaaaaaahahahha')
            }
        // }
        return heatmapData;
    }

    /**
        Renders the 'message' property, and will also add a person's name returned
            by the express server (Stored in this.state.response  @see {@link getApiData})
    */
    render() {
        return (
            <div style={{ height: '600px' }}>
                <GoogleMapReact
                    onChange={this.props.onMapChange}
                    bootstrapURLKeys={{ key: config.googleMapsApiKey }}
                    center={{ lat: 39.2556, lng: -76.7110 }}
                    zoom={11}
                    heatmapLibrary={true}
                    heatmap={this.getHeatmapData(this.props.metricName, this.props.metricData)}
                    onGoogleApiLoaded={({map, maps}) => console.log(map, maps)}
                    yesIWantToUseGoogleMapApiInternals
                >
                    <MetricLabel
                        lat={39.2556}
                        lng={-76.7110}
                        metricName={this.props.metricName}
                    />
                </GoogleMapReact>
            </div>
        );
    }
}

MapComponent.propTypes = {
    metricName: PropTypes.string.isRequired,
};

export default MapComponent;
