import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types';
import {GoogleApiWrapper} from 'google-maps-react'

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
        console.log("Data: ", data)

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
        } else {
            console.log("Nothing was put in crimes")
        }

        return [
            {lat: 39.3278, lng: -76.6192}, 
            {lat: 39.103969, lng: -76.843785}, 
            {lat: 39.0957812, lng: -76.84830029999999},
            {lat: 39.12, lng: -76.9},
            {lat: 39.32, lng: -76.5},  
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
                //console.log('setting heatmap', data);
                heatmapData = {
                    positions: this.processCrime(data),
                };
//                console.log(heatmapData);
            } catch (err) {
                console.log('aaaaaaaahahahha')
            }
        // }
        return heatmapData;
    }

    // Callback click function
    onMarkerClick(data) {
        this.props.onMarkerClickCallback(data);
    }

    mapChange(bounds) {
        this.props.onMapChange(bounds);
    }


    // Initital load
    componentDidMount(){
        this.loadMap(); 
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.metricName === "crime") {
           this.crimeMap(this.map.getCenter().lat(), this.map.getCenter().lng(), this.map.getZoom());
        } 
        else if (this.props.metricName === "income") {
            this.incomeMap(this.map.getCenter().lat(), this.map.getCenter().lng(), this.map.getZoom());
        } 
        else if (this.props.metricName === "commute") {
            this.commuteMap(this.map.getCenter().lat(), this.map.getCenter().lng(), this.map.getZoom());
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
            const mapConfig = Object.assign({}, {
                center: {lat: 39.2556, lng:-76.7110},
                zoom: 11
            })

            // Make a new map
            this.map = new maps.Map(node, mapConfig);
        }
    }

    // load the crime map
    crimeMap(clat, clng, cZoom) {
        if (this.props && this.props.google) {
            const {google} = this.props;
            const maps = google.maps;

        // Sets up the reference for the map
        const mapRef = this.refs.map;
        const node = ReactDOM.findDOMNode(mapRef);

        // Configure all the things
        const mapConfig = Object.assign({}, {
            center: {lat: clat, lng: clng},
            zoom: cZoom
        })

        // Make a new map
        this.map = new maps.Map(node, mapConfig);
    
        // Set up the bounds for the grid
        var bounds = this.map.getBounds();
        

        // Update the heatmap when the bounds change
        this.map.addListener("dragend", () => this.mapChange(bounds));
        this.map.addListener("zoom_changed", () => this.mapChange(bounds));

        // Get the edges
        var smallestLat = bounds.getSouthWest().lat();
        var smallestLng = bounds.getSouthWest().lng();
        var largestLat = bounds.getNorthEast().lat();
        var largestLng = bounds.getNorthEast().lng();

        // Find how much total lat and lng are taken up
        var totalLat = largestLat - smallestLat;
        var totalLng = largestLng - smallestLng;

        // init grid for points and grid for info for those points
        var grid = [];
        var gridData = [];

        // This make a 10x10 grid
        var dim = 10;

        // Build the grid
        for (var i = 0; i < dim; i++) {
            var row = [];
            var rowData = [];
            for (var j = 0; j < dim; j++) {
                row.push(0)
                rowData.push([]);
            }
            grid.push(row)
            gridData.push(rowData)
        }
        

        // Set up first heatmap data
        var newlocs = this.getHeatmapData(this.props.metricName, this.props.metricData)
            
        var exData = ["Assault", "Robbery", "Sad"]
        // Iterate through all given information
        for (var i = 0; i < newlocs["positions"].length; i++) {

            // Get instance of lat and lng for convienence
            var thisLat = newlocs["positions"][i]["lat"];
            var thisLng = newlocs["positions"][i]["lng"];   

            // Put that in the grid at the correct position
            for (var j = 0; j < dim; j++) {
                for (var k = 0; k < dim; k++){
                    
                    // Set up the bounds for that location
                    var leftBound = smallestLat + (totalLat / dim) * k;
                    var rightBound = leftBound + (totalLat / dim);
                    var bottomBound = smallestLng + (totalLng / dim) * j;
                    var topBound = bottomBound +(totalLng / dim);

                    // Check left, right, up, down bounds
                    if (thisLat >= leftBound && thisLat <= rightBound && thisLng <= topBound && thisLng >= bottomBound){
                        // If in update grid to be +1
                        grid[j][k] += 1;
                        gridData[j][k].push(exData[0])
                        break;
                    }
                }
            }
        }

        // Build the heatmaps out of the data 
        var heatmapDataGood = [];
        var heatmapDataBad  = [];

        // Iterate through the built grid
        for (var i = 0; i < dim; i++) {
            for (var j = 0; j < dim; j++) {

                // Get info for convience
                var leftBound = smallestLat + (totalLat / dim) * j;
                var bottomBound = smallestLng + (totalLng / dim) * i;

                // Lat and lng for where the heatmap dot will be center upon
                var centerLat = leftBound + (totalLat/dim)/2;
                var centerLng = bottomBound + (totalLng/dim)/2;

                // If there is a crime make it red
                if (grid[i][j] > 0) {
                    heatmapDataBad.push({
                        location: new google.maps.LatLng(centerLat, centerLng),
                        weight: 1
                    })

                    // Add a marker with info about the crime
                    const marker = new google.maps.Marker({
                        position: new google.maps.LatLng(centerLat, centerLng),
                        map: this.map,
                        information: gridData[i][j][0]
                    });

                    marker.addListener('click', () => this.onMarkerClick(marker.information));

                // If there is no crime make it green
                } else {
                    heatmapDataGood.push({
                        location: new google.maps.LatLng(centerLat, centerLng),
                        weight: 1
                    })
                }
            }
        }

         // Makes green (good) heatmap
        var heatmapGood = new google.maps.visualization.HeatmapLayer({
            data: heatmapDataGood,
            radius: 45,
            gradient: [ 
                'rgba(0, 255, 0, 0)',
                'rgba(0, 255, 0, 1)',
            ]
        });
        heatmapGood.setMap(this.map);
        
        // Makes the red (bad) heatmap
        var heatmapBad = new google.maps.visualization.HeatmapLayer({
            data: heatmapDataBad,
            radius: 45,
            gradient: [
                'rgba(255, 0, 0, 0)',
                'rgba(255, 0, 0, 1)',
            ]
        });
        heatmapBad.setMap(this.map);   

        }
    }

    // Load the income map
    incomeMap(clat, clng, cZoom) {
        if (this.props && this.props.google) {
            const {google} = this.props;
            const maps = google.maps;

        // Sets up the reference for the map
        const mapRef = this.refs.map;
        const node = ReactDOM.findDOMNode(mapRef);

        // Configure all the things
        const mapConfig = Object.assign({}, {
            center: {lat: clat, lng: clng},
            zoom: cZoom
        })

        // Make a new map
        this.map = new maps.Map(node, mapConfig);

        this.map.addListener("bounds_changed", function(){
           

        });


        var heatmapDataGood = [];
        

        for (var i = 0; i < 10; i++) {

            const marker = new google.maps.Marker({
                position: new google.maps.LatLng(39.2556-i/100, -76.7110-i/100),
                map:this.map

            })

            marker.addListener('click', function() {
                console.log("Making that money")
            })

            heatmapDataGood.push({
            location: new google.maps.LatLng(39.2556-i/100, -76.7110-i/100),
              weight: 1
            })
        }

        // Makes the first heatmap
        var heatmapGood = new google.maps.visualization.HeatmapLayer({
            data: heatmapDataGood,
            radius: 30,
            gradient: [ 
                'rgba(0, 255, 0, 0)',
                'rgba(0, 255, 0, 1)',
            ]
        });
        heatmapGood.setMap(this.map);
        }
    }

    // Load the commute map
    commuteMap(clat, clng, cZoom) {
        if (this.props && this.props.google) {
            const {google} = this.props;
            const maps = google.maps;

        // Sets up the reference for the map
        const mapRef = this.refs.map;
        const node = ReactDOM.findDOMNode(mapRef);

        // Configure all the things
        const mapConfig = Object.assign({}, {
            center: {lat: clat, lng: clng},
            zoom: cZoom
        })

        // Make a new map
        this.map = new maps.Map(node, mapConfig);

        this.map.addListener("bounds_changed", function(){
           
        });

        var heatmapDataGood = [];
        
        for (var i = 0; i < 10; i++) {
            heatmapDataGood.push({
            location: new google.maps.LatLng(39.2556+i/100, -76.7110+i/100),
              weight: 1
            })

            const marker = new google.maps.Marker({
                position: new google.maps.LatLng(39.2556+i/100, -76.7110+i/100),
                map:this.map

            })

            marker.addListener('click', function() {
                console.log("Zoom")
            })
        }
        
        // Makes the first heatmap
        var heatmapGood = new google.maps.visualization.HeatmapLayer({
            data: heatmapDataGood,
            radius: 30,
            gradient: [ 
                'rgba(0, 255, 0, 0)',
                'rgba(0, 255, 0, 1)',
            ]
        });
        heatmapGood.setMap(this.map);
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
    onMapChange: PropTypes.func.isRequired
};

export default GoogleApiWrapper({
    apiKey: config.googleMapsApiKey,
    libraries: ['visualization']
}) (MapComponent)
