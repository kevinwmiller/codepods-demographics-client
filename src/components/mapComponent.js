import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import server from '../services/server';
import GoogleMapReact from 'google-map-react';



const config = require('../config');

const MetricLabel = ({ metricName }) => <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{metricName}</div>;
MetricLabel.propTypes = {
    metricName: PropTypes.string.isRequired,
};

const mapMarkerClassName = 'mapMarkerClassName';

class MapMarker extends Component {
    render() {
      return (
        <div className={mapMarkerClassName}>Marker</div>
      );
    }
  }





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
            <div style={{ height: '300px', width: '100%' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: config.googleMapsApiKey }}
                    center={{ lat: 39.2556, lng: -76.7110 }}
                    zoom={11}   
                    heatmapLibrary={true}
                    heatmap={{
                        positions: [
                            {
                                lat: 39.2556,
                                lng: -76.711,
                            },
                            {
                                lat: 39.2554,
                                lng: -76.710,
                            },
                            {
                                lat: 39.2552,
                                lng: -76.709,
                            },
                        ],

                        options: {
                            radius: 20,
                            opacity: 0.7,

                            
                        },
                    }}
                >
                    <MetricLabel
                        lat={39.2556}
                        lng={-76.7110}
                        metricName={this.props.metricName}
                    />

                </GoogleMapReact>
                <h3>SGO Google Maps Demo</h3>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: config.googleMapsApiKey }}
                    center= {{lat: -25.363, lng: 131.044}}
                    zoom={4}   
                    heatmapLibrary={true}
                    heatmap={{
                        positions: [
                            {
                                lat: -25.363,
                                lng: 131.044,
                            },
                            {
                                lat: -25.362,
                                lng: 131.043,
                            },
                            {
                                lat: -25.361,
                                lng: 131.042,
                            },
                        ],

                        options: {
                            radius: 20,
                            opacity: 0.7,

                            
                        },
                    }}
                >
                    <MetricLabel
                        lat={-25.363}
                        lng={131.044}
                        metricName={this.props.metricName}
                    />     

 <MapMarker lat={-26.36} lng={132.042} />
                </GoogleMapReact>
             

     

            </div>







        );
    }
}

MapComponent.propTypes = {
    metricName: PropTypes.string.isRequired,
};

export default MapComponent;
