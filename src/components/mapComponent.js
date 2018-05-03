import React, { Component } from 'react';
import PropTypes from 'react'
import ReactDOM from 'react-dom'
import {Map, GoogleApiWrapper} from 'google-maps-react'

const config = require('../config');

/**
  * A wrapper around a GoogleMap component that controls the rendering of different metric data
  * @reactProps {string} metricName - The metric to display
  */

class MapComponent extends Component {
    /**
        Renders the 'message' property, and will also add a person's name returned
            by the express server (Stored in this.state.response  @see {@link getApiData})
    */

    componentDidMount() {
        this.loadMap(39.2556, -76.7110);
    }

    componentDidUpdate(prevProps, prevState) {
        this.loadMap(39.2556, -76.7110);
    }

    // Does the actual work to set up the map
    loadMap(lat, lng) {
        if (this.props && this.props.google) {
            const {google} = this.props;
            const maps = google.maps;

    // Sets up the reference for the map
    const mapRef = this.refs.map;
        const node = ReactDOM.findDOMNode(mapRef);

    // Configure all the things
    const mapConfig = Object.assign({}, {
        center: {lat: lat, lng:lng},
        gestureHandling: "cooperative",
        zoom: 11
    })

        // Make a new map
        this.map = new maps.Map(node, mapConfig);

        // Set up first heatmap data
        var heatmapData1 = [];

        for (var i = 0; i < 15; i++) {
            var change =  Math.random();
            var sign = 1;
            if (Math.random() > .49) {
                sign = -1;
            }
            change *= sign;

            // Test marker
            const markerGood = new google.maps.Marker({
                position: {lat: 39.2556 + change, lng:-76.7110 + change},
                map: this.map,
                title: "good"
            })

            var infowindowGood = new google.maps.InfoWindow({
                content: `<h3> Good marker </h3>`
            })

            markerGood.addListener('click', function() {
                infowindowGood.open(this.map, markerGood);
            });

            heatmapData1.push({

                location: new google.maps.LatLng(39.2556 + change, -76.7110 + change),
                weight: 1
            })
        }

        // Set up second heatmap data
        var heatmapData2 = [];
        for (var i = 0; i < 15; i++) {
            var change =  Math.random();
            var sign = 1;
            if (Math.random() > .49) {
                sign = -1;
            }
            change *= sign;
            // Test marker
            const markerBad = new google.maps.Marker({
                position: {lat: 39.2655 + change, lng:-76.811 + change},
                map: this.map,
                title: "bad"
            })

            var infowindowBad = new google.maps.InfoWindow({
                content: `<h3> Bad marker </h3>`
            })

            markerBad.addListener('click', function() {
                infowindowBad.open(this.map, markerBad);
            });

            heatmapData2.push({

                location: new google.maps.LatLng(39.2655 + change, -76.811 + change),
                weight: 1
            })
        }

        // Makes the first heatmap good
        var heatmap1 = new google.maps.visualization.HeatmapLayer({
            data: heatmapData1,
            radius: 51,
            gradient: [ 
                'rgba(0, 255, 0, 0)',
                'rgba(0, 255, 0, 1)',
            ]
        });
        heatmap1.setMap(this.map);

        // Makes the second heatmap bad
        var heatmap2 = new google.maps.visualization.HeatmapLayer({
            data: heatmapData2,
            radius: 50,
            gradient: [ 
                'rgba(255, 0, 0, 0)',
                'rgba(255, 0, 0, 1)',
            ]
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
