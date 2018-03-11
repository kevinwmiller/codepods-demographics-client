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
    /**
        Renders the 'message' property, and will also add a person's name returned
            by the express server (Stored in this.state.response  @see {@link getApiData})
    */
    render() {
        return (
            <div style={{ height: '600px' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: config.googleMapsApiKey }}
                    center={{ lat: 39.2556, lng: -76.7110 }}
                    zoom={11}
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
