import React, { Component } from 'react';
import ReactDOM from 'react-dom'
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
                console.log('setting heatmap', data);
                heatmapData = {
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

        this.map.addListener("bounds_changed", function(){
           

        });

        var bounds = this.map.getBounds();
        console.log("Lat", bounds.getSouthWest().lat(), bounds.getSouthWest().lng(), "Lng", bounds.getNorthEast().lat(), bounds.getNorthEast().lng());
    
        var smallestLat = bounds.getSouthWest().lat();
        var smallestLng = bounds.getSouthWest().lng();
        var largestLat = bounds.getNorthEast().lat();
        var largestLng = bounds.getNorthEast().lng();

        var totalLat = largestLat - smallestLat;
        var totalLng = largestLng - smallestLng;

        console.log("TotalLat: ", totalLat, "TotalLng: ", totalLng);

        var grid = []

        // Set up first heatmap data
        var newlocs = this.getHeatmapData(this.props.metricName, this.props.metricData)
        var heatmapDataGood = [];
            
        for (var i = 0; i < newlocs["positions"].length; i++) {

            const marker = new google.maps.Marker({
                position: new google.maps.LatLng(newlocs["positions"][i]["lat"], newlocs["positions"][i]["lng"]),
                map:this.map
            })

            marker.addListener('click', function() {
                console.log("How criminal")
            })

            heatmapDataGood.push({
                location: new google.maps.LatLng(newlocs["positions"][i]["lat"], newlocs["positions"][i]["lng"]),
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

export default GoogleApiWrapper({
    apiKey: config.googleMapsApiKey,
    libraries: ['visualization']
}) (MapComponent)
