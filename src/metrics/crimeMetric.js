import Qs from 'qs'
import server from '../services/server'

// These can and probably should be moved to their own file
const lengthOfLatitudeDegreeAtEquator = 69.172;

function convertToRadians(degreeValue) {
    return (degreeValue * Math.PI) / 180;
}

/**
 * Class for crime metric.
 *
 * @class      CrimeMetric (name)
 */
export default class {

    constructor() {
        this.previousHeatmap = null;
    }

    clearData = () => {
        this.heatmap.setMap(null);
        this.heatmap = null;
        this.previousHeatmap = null;
    }

    processCrimeData = (googleMaps, crimeData, map) => {
        if (!crimeData) {
            return [];
        }
        const bounds = map.getBounds()
        const width = bounds.getNorthEast().lng() - bounds.getSouthWest().lng();
        const height = bounds.getNorthEast().lat() - bounds.getSouthWest().lat();

        const squareMilesPerCell = 2;

        // Length of longitude varies depending on your latitude
        // 1° longitude = cosine (latitude) * length of degree (miles) at equator
        const lengthOfLongitudeMile = Math.abs(Math.cos(convertToRadians(bounds.getNorthEast().lat())) * lengthOfLatitudeDegreeAtEquator);
        console.log(lengthOfLongitudeMile);
        // 1 degree of latitude is approximately 69 miles
        // 0.072463781159 degrees of latitude is approximately 5 miles
        const fiveMilesInLatitudeDegrees = squareMilesPerCell / lengthOfLatitudeDegreeAtEquator;
        const fiveMilesInLongitudeDegrees = squareMilesPerCell / lengthOfLongitudeMile;
        console.log(fiveMilesInLatitudeDegrees);
        console.log(fiveMilesInLongitudeDegrees);

        const gridHeight = Math.ceil(height / fiveMilesInLatitudeDegrees);
        const gridWidth = Math.ceil(width / fiveMilesInLongitudeDegrees);

        console.log(`Height: ${gridHeight}`);
        console.log(`Width: ${gridWidth}`);
        // Create an empty grid
        let grid = Array.apply([], Array(gridHeight));
        grid.map(row => {
            return Array.apply([], Array(gridWidth));
        });

        console.log(crimeData);

        return [];
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
                        latitude: bounds.getNorthEast().lat(),
                        longitude: bounds.getNorthEast().lng(),
                    },
                    bottomLeft: {
                        latitude: bounds.getSouthWest().lat(),
                        longitude: bounds.getSouthWest().lng(),
                    },
                }
            },
            // Prevent axios from encoding our json object incorrectly
            paramsSerializer: function(params) {
                // console.log("Response", Qs.stringify(params, {arrayFormat: 'brackets'}));
                return Qs.stringify(params, {arrayFormat: 'brackets'});
            },
        });
        return response.data.response;
    }

// load the crime map
    // crimeMap(map) {

    //         let bounds = map.getBounds();

    //         // Find how much total lat and lng are taken up
    //         let totalLat = bounds.getNorthEast().lat() - bounds.getSouthWest().lat();
    //         let totalLng = bounds.getNorthEast().lng() - bounds.getSouthWest().lng();

    //         // init grid for points and grid for info for those points
    //         let mapGrid = {
    //             buckets: [],
    //             bucketData: [],
    //         }
    //         let mapBuckets = [];
    //         let bucketData = [];

    //         // This make a 10x10 grid
    //         let dim = 10;

    //         // Build the grid
    //         for (let i = 0; i < dim; i++) {
    //             let row = [];
    //             let rowData = [];
    //             for (let j = 0; j < dim; j++) {
    //                 row.push(0)
    //                 rowData.push([]);
    //             }
    //             grid.push(row)
    //             gridData.push(rowData)
    //         }
            

    //         // Set up first heatmap data
    //         let newlocs = fetchCrimeData(bounds);
                
    //         // Iterate through all given information
    //         for (let i = 0; i < newlocs["positions"].length; i++) {

    //             // Get instance of lat and lng for convienence
    //             let thisLat = newlocs["positions"][i]["lat"];
    //             let thisLng = newlocs["positions"][i]["lng"];   

    //             // Put that in the grid at the correct position
    //             for (let j = 0; j < dim; j++) {
    //                 for (let k = 0; k < dim; k++){
                        
    //                     // Set up the bounds for that location
    //                     let leftBound = smallestLat + (totalLat / dim) * k;
    //                     let rightBound = leftBound + (totalLat / dim);
    //                     let bottomBound = smallestLng + (totalLng / dim) * j;
    //                     let topBound = bottomBound +(totalLng / dim);

    //                     // Check left, right, up, down bounds
    //                     if (thisLat >= leftBound && thisLat <= rightBound && thisLng <= topBound && thisLng >= bottomBound){
    //                         // If in update grid to be +1
    //                         grid[j][k] += 1;
    //                         gridData[j][k].push(exData[0])
    //                         break;
    //                     }
    //                 }
    //             }
    //         }

    //         // Build the heatmaps out of the data 
    //         let heatmapDataGood = [];
    //         let heatmapDataBad  = [];

    //         // Iterate through the built grid
    //         for (let i = 0; i < dim; i++) {
    //             for (let j = 0; j < dim; j++) {

    //                 // Get info for convience
    //                 let leftBound = smallestLat + (totalLat / dim) * j;
    //                 let bottomBound = smallestLng + (totalLng / dim) * i;

    //                 // Lat and lng for where the heatmap dot will be center upon
    //                 let centerLat = leftBound + (totalLat/dim)/2;
    //                 let centerLongitude = bottomBound + (totalLng/dim)/2;

    //                 // If there is a crime make it red
    //                 if (grid[i][j] > 0) {
    //                     heatmapDataBad.push({
    //                         location: new google.maps.LatLng(centerLat, centerLongitude),
    //                         weight: 1
    //                     })

    //                     // Add a marker with info about the crime
    //                     const marker = new google.maps.Marker({
    //                         position: new google.maps.LatLng(centerLat, centerLongitude),
    //                         map: map,
    //                         information: gridData[i][j][0]
    //                     });

    //                     marker.addListener('click', () => this.onMarkerClick(marker.information));

    //                 // If there is no crime make it green
    //                 } else {
    //                     heatmapDataGood.push({
    //                         location: new google.maps.LatLng(centerLat, centerLongitude),
    //                         weight: 1
    //                     })
    //                 }
    //             }
    //         }
    // }

    updateMap = async (googleMaps, map) => {
        const crimeData = await this.fetchCrimeData(map.getBounds());
        console.log(crimeData);
        const heatmapData = this.processCrimeData(googleMaps, crimeData, map);
        let color = Math.ceil(Math.random() * 255);
        let baseColor = `rgba(${color}, 0, 0, 1)`;
        console.log(baseColor);
        this.heatmap = new googleMaps.visualization.HeatmapLayer({
            data: heatmapData,
            radius: 45,
            gradient: [
                baseColor,
                'rgba(0, 255, 0, 1)',
            ]
        });
        if (this.previousHeatmap) {
            this.previousHeatmap.setMap(null);
        }
        this.heatmap.setMap(map);
        this.previousHeatmap = this.heatmap;
    }
}
