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

/**
 * Class for map component.
 *
 * @class      MapComponent (name)
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
            {lat: 39.3278, lng: -76.6192, category: "violent"}, 
            {lat: 39.103969, lng: -76.843785, category: "violent"}, 
            {lat: 39.0957812, lng: -76.84830029999999, category: "violent"},
            {lat: 39.12, lng: -76.9, category: "property"},
            {lat: 39.32, lng: -76.5, category: "property"},  
            {lat: 39.4, lng: -76.66, category: "violent"}, 
            {lat: 39.11234, lng: -76.3456, category: "violent"}, 
            {lat: 39.0543, lng: -76.7534, category: "violent"},
            {lat: 39.234, lng: -76.64, category: "property"},
            {lat: 39.634, lng: -76.23, category: "property"},  
            {lat: 39.745, lng: -76.43, category: "violent"}, 
            {lat: 39.543, lng: -76.643, category: "violent"}, 
            {lat: 39.1234, lng: -76.83453, category: "violent"},
            {lat: 39.643, lng: -76.345, category: "property"},
            {lat: 39.32, lng: -76.1234, category: "property"},  

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

    /**
     * { onMarkerClick }
     *
     * @param      {<type>}  data    The data
     */
    onMarkerClick(data) {
        this.props.onMarkerClickCallback(data);
    }

    /**
     * { mapChange }
     *
     * @param      {<type>}  bounds  The bounds
     */
    mapChange(bounds) {
        this.props.onMapChange(bounds);
    }

    /**
     * { compnentDidMount }
     */
    componentDidMount(){
        this.loadMap(); 
    }

    /**
     * { componentDidUpdate }
     *
     * @param      {<type>}  prevProps  The previous properties
     * @param      {<type>}  prevState  The previous state
     */
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

    /**
     * Loads a map.
     */
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

    /**
     * { crimeMap }
     *
     * @param      {<type>}  clat    The Latitude Center
     * @param      {<type>}  clng    The Longitude Center
     * @param      {<type>}  cZoom   The Zoom Level
     */
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
            zoom: cZoom,
            minZoom: 8
        })

        // Make a new map
        this.map = new maps.Map(node, mapConfig);
    
        // Set up the bounds for the grid
        var bounds = this.map.getBounds();
        
        // Update the heatmap when the bounds change
        this.map.addListener("dragend", () => this.mapChange(bounds));
        this.map.addListener("zoom_changed", () => this.mapChange(bounds));

        // Get the edges of the boundary
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

        // This makes a 10x10 grid
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
       
        // Iterate through all given information
        for (i = 0; i < newlocs["positions"].length; i++) {

            // Get instance of lat and lng for convienence
            var thisLat = newlocs["positions"][i]["lat"];
            var thisLng = newlocs["positions"][i]["lng"];   

            // Put that in the grid at the correct position
            for (j = 0; j < dim; j++) {
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
                        gridData[j][k].push({"category": newlocs["positions"][i]["category"]}) 
                        break;
                    }
                }
            }
        }

        // Build the heatmaps out of the data 
        var heatmapDataGood = [];
        var heatmapDataBad  = [];
        var heatmapDataMiddle = [];

        // Iterate through the built grid
        for (i = 0; i < dim; i++) {
            for (j = 0; j < dim; j++) {

                // Get info for convience
                leftBound = smallestLat + (totalLat / dim) * j;
                bottomBound = smallestLng + (totalLng / dim) * i;

                // Lat and lng for where the heatmap dot will be center upon
                var centerLat = leftBound + (totalLat/dim)/2;
                var centerLng = bottomBound + (totalLng/dim)/2;

                // If there is a crime make it yellow or red based on what crimes happened there
                if (grid[i][j] > 0) {

                    var crimeInfo = "";
                    var violent = 0;
                    var nonViolent = 0;
                    for (k = 0; k < gridData[i][j].length; k++) {
                        // Would build info about the crime 
                        crimeInfo += gridData[i][j][k]["category"];
                        if (gridData[i][j][k]["category"] === "violent") {
                            violent += 1
                        } else {
                            nonViolent += 1
                        }
                    }

                    // Find out which to put it in
                    if (violent >= nonViolent) {
                        heatmapDataBad.push({
                            location: new google.maps.LatLng(centerLat, centerLng),
                            weight: 1
                        })
                    } else {
                        heatmapDataMiddle.push({
                            location: new google.maps.LatLng(centerLat, centerLng),
                            weight: 1
                        })
                    }


                    // Add a marker with info about the crime
                    const marker = new google.maps.Marker({
                        position: new google.maps.LatLng(centerLat, centerLng),
                        map: this.map,
                        information: crimeInfo
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
            radius: 75,
            gradient: [ 
                'rgba(0, 255, 0, 0)',
                'rgba(0, 255, 0, 1)',
            ]
        });
        heatmapGood.setMap(this.map);
        
        // Makes yellow (middle) heatmap
        var heatmapMiddle = new google.maps.visualization.HeatmapLayer({
            data: heatmapDataMiddle,
            radius: 100,
            gradient: [
                'rgba(255, 255, 0, 0)',
                'rgba(255, 255, 0, 1)',
            ]
        })
        heatmapMiddle.setMap(this.map);
        
        // Makes the red (bad) heatmap
        var heatmapBad = new google.maps.visualization.HeatmapLayer({
            data: heatmapDataBad,
            radius: 75,
            gradient: [
                'rgba(255, 0, 0, 0)',
                'rgba(255, 0, 0, 1)',
            ]
        });
        heatmapBad.setMap(this.map);   

        }
    }

    /**
     * { incomeMap }
     *
     * @param      {<type>}  clat    The clat
     * @param      {<type>}  clng    The clng
     * @param      {<type>}  cZoom   The zoom
     */
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

        // Grab the bounds
        var bounds = this.map.getBounds();

        // Update the heatmap when the bounds change
        this.map.addListener("dragend", () => this.mapChange(bounds));
        this.map.addListener("zoom_changed", () => this.mapChange(bounds));


        var heatmapDataGood = [];
        var heatmapDataMiddle = [];
        var heatmapDataBad = [];
        
        heatmapDataGood.push(new google.maps.LatLng(39.2556, -76.3452))
        heatmapDataGood.push(new google.maps.LatLng(39.2345, -76.6453))
        heatmapDataGood.push(new google.maps.LatLng(39.6324, -76.3412))
        heatmapDataGood.push(new google.maps.LatLng(39.7564, -76.7645))
        heatmapDataGood.push(new google.maps.LatLng(39.4532, -76.2345))

        heatmapDataMiddle.push(new google.maps.LatLng(39.3453, -76.2345))
        heatmapDataMiddle.push(new google.maps.LatLng(39.6754, -76.6432))         
        heatmapDataMiddle.push(new google.maps.LatLng(39.2433, -76.1345))
        heatmapDataMiddle.push(new google.maps.LatLng(39.7543, -76.5643))         
        heatmapDataMiddle.push(new google.maps.LatLng(39.4864, -76.5346))    

        heatmapDataBad.push(new google.maps.LatLng(39.6343, -76.23456))
        heatmapDataBad.push(new google.maps.LatLng(39.23452, -76.7564))         
        heatmapDataBad.push(new google.maps.LatLng(39.5764, -76.34533))
        heatmapDataBad.push(new google.maps.LatLng(39.2346, -76.7433))         
        heatmapDataBad.push(new google.maps.LatLng(39.9786, -76.2345))    
 
        // Makes the green (good) heatmap
        var heatmapGood = new google.maps.visualization.HeatmapLayer({
            data: heatmapDataGood,
            radius: 70,
            gradient: [ 
                'rgba(0, 255, 0, 0)',
                'rgba(0, 255, 0, 1)',
            ]
        });
        heatmapGood.setMap(this.map);

        // Makes the yellow (middle) heatmap
        var heatmapMiddle = new google.maps.visualization.HeatmapLayer({
            data: heatmapDataMiddle,
            radius: 70,
            gradient: [ 
                'rgba(255, 255, 0, 0)',
                'rgba(255, 255, 0, 1)',
            ]
        });
        heatmapMiddle.setMap(this.map);

        // Makes the red (bad) heatmap
        var heatmapBad = new google.maps.visualization.HeatmapLayer({
            data: heatmapDataBad,
            radius: 70,
            gradient: [ 
                'rgba(255, 0, 0, 0)',
                'rgba(255, 0, 0, 1)',
            ]
        });
        heatmapBad.setMap(this.map);

        }
    }

    /* 
     * Load the commute heatmap
     */
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

        // Grab the bounds
        var bounds = this.map.getBounds();

        // Update the heatmap when the bounds change
        this.map.addListener("dragend", () => this.mapChange(bounds));
        this.map.addListener("zoom_changed", () => this.mapChange(bounds));




        var heatmapDataGood = [];
        var heatmapDataMiddle = [];
        var heatmapDataBad = [];
        
        heatmapDataGood.push(new google.maps.LatLng(39.2556, -76.3452))
        heatmapDataGood.push(new google.maps.LatLng(39.2345, -76.7453))
        heatmapDataGood.push(new google.maps.LatLng(39.2643, -76.3412))
        heatmapDataGood.push(new google.maps.LatLng(39.2754, -76.7645))
        heatmapDataGood.push(new google.maps.LatLng(39.3754, -76.2345))

        heatmapDataMiddle.push(new google.maps.LatLng(39.4352, -76.5322))
        heatmapDataMiddle.push(new google.maps.LatLng(39.3452, -76.23452))         
        heatmapDataMiddle.push(new google.maps.LatLng(39.6433, -76.45342))
        heatmapDataMiddle.push(new google.maps.LatLng(39.1345, -76.8545))         
        heatmapDataMiddle.push(new google.maps.LatLng(39.8675, -76.1345))    

        heatmapDataBad.push(new google.maps.LatLng(39.6343, -76.23452))
        heatmapDataBad.push(new google.maps.LatLng(39.23452, -76.6453))         
        heatmapDataBad.push(new google.maps.LatLng(39.4325, -76.33543))
        heatmapDataBad.push(new google.maps.LatLng(39.7434, -76.3532))         
        heatmapDataBad.push(new google.maps.LatLng(39.3452, -76.24352))    
 
        // Makes the green (good) heatmap
        var heatmapGood = new google.maps.visualization.HeatmapLayer({
            data: heatmapDataGood,
            radius: 70,
            gradient: [ 
                'rgba(0, 255, 0, 0)',
                'rgba(0, 255, 0, 1)',
            ]
        });
        heatmapGood.setMap(this.map);

        // Makes the yellow (middle) heatmap
        var heatmapMiddle = new google.maps.visualization.HeatmapLayer({
            data: heatmapDataMiddle,
            radius: 70,
            gradient: [ 
                'rgba(255, 255, 0, 0)',
                'rgba(255, 255, 0, 1)',
            ]
        });
        heatmapMiddle.setMap(this.map);

        // Makes the red (bad) heatmap
        var heatmapBad = new google.maps.visualization.HeatmapLayer({
            data: heatmapDataBad,
            radius: 70,
            gradient: [ 
                'rgba(255, 0, 0, 0)',
                'rgba(255, 0, 0, 1)',
            ]
        });
        heatmapBad.setMap(this.map);

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