import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import {Map, GoogleApiWrapper} from 'google-maps-react'

const config = require('../config');

/*
const MetricLabel = ({ metricName }) => <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{metricName}</div>;

MetricLabel.propTypes = {
    metricName: PropTypes.string.isRequired,
};
*/
/**
  * A wrapper around a GoogleMap component that controls the rendering of different metric data
  * @reactProps {string} metricName - The metric to display
  */

class MapComponent extends Component {
    /**
        Renders the 'message' property, and will also add a person's name returned
            by the express server (Stored in this.state.response  @see {@link getApiData})
    */
    componentDidUpdate(prevProps, prevState) {
        this.loadMap();
    }

    // Does the actual work to set up the map
    loadMap() {
        if (this.props && this.props.google) {
            const {google} = this.props;
            const maps = google.maps;

    // Sets up the reference for the map
    const mapRef = this.refs.map;
        const node = ReactDOM.findDOMNode(mapRef);

    // Configure all the things
    const mapConfig = Object.assign({}, {
        center: {lat: 39.2556, lng:-76.7110},
        zoom: 11
        })

        // Make a new map
        this.map = new maps.Map(node, mapConfig);

        // Set up first heatmap data
        var heatmapData1 = [];
        heatmapData1.push({
            location: new google.maps.LatLng(39.2556, -76.7110),
            weight: 1
        })

        // Set up second heatmap data
        var heatmapData2 = [];
        heatmapData2.push({
            location: new google.maps.LatLng(39.2655, -76.811),
            weight: 1
        })

        // Test marker
        const marker = new google.maps.Marker({
            position: {lat: 39.2556, lng:-76.7110},
            map: this.map,
            title: "info"
        })

        // Makes the first heatmap
        var heatmap1 = new google.maps.visualization.HeatmapLayer({
            data: heatmapData1,
            radius: 40
        });
        heatmap1.setMap(this.map);

        // Makes the second heatmap
        var heatmap2 = new google.maps.visualization.HeatmapLayer({
            data: heatmapData2,
            radius: 40
        });
        heatmap2.setMap(this.map);

        }
    }

    render() {
        const style = { width: '100%', height: '600px'}
        return ( 
            <div ref="map" style={style}>
                loading map...
            </div>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: config.googleMapsApiKey,
    libraries: ['visualization']
}) (MapComponent)
