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

    calculateGridSize

    /**
     * Calculates the corresponding cell. TEST ME
     *
     * @param      {<type>}  crime     The crime
     * @param      {<type>}  cellSize  The cell size
     * @param      {<type>}  bounds    The bounds
     * @return     {Array}   The corresponding cell.
     */
    calculateCorrespondingCell = (crime, cellSize, bounds, gridSize) => {
        const topLeftCoordinates = {
            latitude: bounds.getNorthEast().lat(),
            longitude: bounds.getSouthWest().lng(),
        };
        const distanceFromTopLeft = {
            // Absolute value since latitude of crime will be smaller than the latitude of the top left corner
            height: Math.abs(crime.location.latitude - topLeftCoordinates.latitude),
            width: Math.abs(crime.location.longitude - topLeftCoordinates.longitude),
        };
        let cell = [
            Math.floor(distanceFromTopLeft.height / cellSize.height),
            Math.floor(distanceFromTopLeft.width / cellSize.width),
        ]
        // Doing this to fix any precision errors that are occurring during division.
        // These error sometimes push the quotient over the "cell boundary" into an invalid cell
        if (cell[0] >= gridSize.height) {
            cell[0] = gridSize.height - 1;
        }
        if (cell[1] >= gridSize.width) {
            cell[1] = gridSize.width - 1;
        }
        return cell;
    }

    buildGrid = (crimeData, map) => {
        const bounds = map.getBounds()
        const viewportSize = {
            height: bounds.getNorthEast().lat() - bounds.getSouthWest().lat(),
            width: bounds.getNorthEast().lng() - bounds.getSouthWest().lng(),
        };
        const squareMilesPerCell = 1;
        // Length of longitude varies depending on your latitude
        // 1° longitude = cosine (latitude) * length of degree (miles) at equator
        const lengthOfLongitudeMile = Math.abs(Math.cos(convertToRadians(bounds.getNorthEast().lat())) * lengthOfLatitudeDegreeAtEquator);
        // 1 degree of latitude is approximately 69 miles
        // 0.072463781159 degrees of latitude is approximately 5 miles
        const fiveMilesInLatitudeDegrees = squareMilesPerCell / lengthOfLatitudeDegreeAtEquator;
        const fiveMilesInLongitudeDegrees = squareMilesPerCell / lengthOfLongitudeMile;
        const gridSize = {
            height: Math.ceil(viewportSize.height / fiveMilesInLatitudeDegrees),
            width: Math.ceil(viewportSize.width / fiveMilesInLongitudeDegrees)
        };
        const cellSize = {
            height: viewportSize.height / gridSize.height,
            width: viewportSize.width / gridSize.width,
        }
        // Create a grid with an empty list in each cell
        let grid = Array(gridSize.height).fill().map(() => {
            return Array(gridSize.width).fill().map(() => {
                return {
                    cellCenterCoordinates: {
                        latitude: 0,
                        longitude: 0,
                    },
                    cellData: [],
                };
            });
        });

        // Set center coordinates of each cell. Can probably do this in a cleaner way, but this works for now
        for (let row of grid.keys()) {
            for (let column of grid[row].keys()) {
                grid[row][column].cellCenterCoordinates = {
                    latitude: row * cellSize.height + (cellSize.height / 2) + bounds.getNorthEast().lat(),
                    longitude: column * cellSize.width + (cellSize.width / 2) + bounds.getSouthWest().lng(),
                }
            }
        }
        for (let agency of crimeData) {
            for (let crime of agency.crimes) {
                // Determine grid cell for crime
                const gridCell = this.calculateCorrespondingCell(crime, cellSize, bounds, gridSize);
                grid[gridCell[0]][gridCell[1]].cellData.push(crime);
            }
        }
        return grid;
    }

    processCrimeData = (googleMaps, crimeData, map, callbacks) => {
        if (!crimeData) {
            return [];
        }
        let grid = this.buildGrid(crimeData, map);
        const avgCrimesPerSquareMile = 2;
        let heatmapData = [];
        for (let row of grid.keys()) {
            for (let column of grid[row].keys()) {
                    // console.log(grid[row][column]);
                    const cellLocation = grid[row][column].cellCenterCoordinates;
                    // console.log(cellLocation);
                    heatmapData.push({
                        location: new googleMaps.LatLng(cellLocation.latitude, cellLocation.longitude),
                        weight: 1
                    });

                    // console.log(crimeData);
                    // Add a markers for crimes
                    for (let agency of crimeData) {
                        for (let crime of agency.crimes) {
                            // Determine grid cell for crime
                            const marker = new googleMaps.Marker({
                                position: new googleMaps.LatLng(crime.location.latitude, crime.location.longitude),
                                map: map,
                                information: [
                                    {label: 'Case Number', value: crime.caseNumber},
                                    {label: 'Address', value: crime.incidentAddress},
                                    {label: 'City', value: crime.city},
                                    {label: 'Description', value: crime.incidentDescription},
                                    {label: 'Date of Occurrence', value: crime.timestamp},
                                    {label: 'Category', value: crime.categorization.category},
                                    {label: 'Type', value: crime.primaryType},
                                ],
                            });
                            marker.addListener('click', () => callbacks.onMarkerClick(marker.information));
                        }
                    }
            }
        }
        // for (let data of heatmapData) {
            // console.log(data.location);
        // }
        return heatmapData;
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
                console.log("Response", Qs.stringify(params, {arrayFormat: 'brackets'}));
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

    updateMap = async (googleMaps, map, callbacks) => {
        const crimeData = await this.fetchCrimeData(map.getBounds());
        console.log(crimeData);
        const heatmapData = this.processCrimeData(googleMaps, crimeData, map, callbacks);
        let color = Math.ceil(Math.random() * 255);
        this.heatmap = new googleMaps.visualization.HeatmapLayer({
            data: heatmapData,
            radius: 45,
            gradient: [
                'rgba(0, 255, 255, 0)',
                'rgba(0, 255, 255, 1)',
                'rgba(0, 191, 255, 1)',
                'rgba(0, 127, 255, 1)',
                'rgba(0, 63, 255, 1)',
                'rgba(0, 0, 255, 1)',
                'rgba(0, 0, 223, 1)',
                'rgba(0, 0, 191, 1)',
                'rgba(0, 0, 159, 1)',
                'rgba(0, 0, 127, 1)',
                'rgba(63, 0, 91, 1)',
                'rgba(127, 0, 63, 1)',
                'rgba(191, 0, 31, 1)',
                'rgba(255, 0, 0, 1)'
            ]
        });
        if (this.previousHeatmap) {
            this.previousHeatmap.setMap(null);
        }
        this.heatmap.setMap(map);
        this.previousHeatmap = this.heatmap;
    }
}
