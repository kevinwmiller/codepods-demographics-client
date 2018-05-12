import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types';
import {GoogleApiWrapper} from 'google-maps-react';

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

    onMarkerClick = (data) => {
        console.log('clicked');
        this.props.onMarkerClickCallback(data);
    }

    mapChange = () => {
        if (this.props && this.props.google) {
            const {google} = this.props;
            const maps = google.maps;
            this.props.metrics.updateMap(maps, this.props.metricName, this.map, {
                onMarkerClick: this.onMarkerClick
            });
        }
    }

    componentDidMount(){
        this.loadMap(); 
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props && this.props.google) {
            const {google} = this.props;
            const maps = google.maps;
            this.props.metrics.updateMap(maps, this.props.metricName, this.map, {
                onMarkerClick: this.onMarkerClick
            });
        }
    }

    // Initial Load
    loadMap() {
        if (this.props && this.props.google) {
            const {google} = this.props;
            const maps = google.maps;

            // Sets up the reference for the map
            const mapRef = this.refs.map;
            const node = ReactDOM.findDOMNode(mapRef);

            // Configure all the things
            const mapConfig = {
                center: {lat: 39.2556, lng:-76.7110},
                zoom: 14,
            };

            this.map = new maps.Map(node, mapConfig);

            // Update the heatmap when the bounds change
            this.map.addListener("dragend", () => this.mapChange());
            this.map.addListener("zoom_changed", () => this.mapChange());
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

MapComponent.propTypes = {
    onMarkerClickCallback: PropTypes.func.isRequired,
};

export default GoogleApiWrapper({
    apiKey: config.googleMapsApiKey,
    libraries: ['visualization']
}) (MapComponent)
