import Qs from 'qs'
import server from '../services/server'

// These can and probably should be moved to their own file
const lengthOfLatitudeDegreeAtEquator = 69.172;

function convertToRadians(degreeValue) {
    return (degreeValue * Math.PI) / 180;
}

const buildGrid =  require('../map/grid').buildGrid;
const calculateCorrespondingCell = require('../map/grid').calculateCorrespondingCell;


/**
 * Class for commute metric.
 *
 * @class      CommuteMetric (name)
 */
export default class {

    constructor() {
        this.previousheatmapLong = null;
        this.previousheatmapAverage = null;
        this.previousheatmapShort = null;
        this.markers = [];
    }

    clearData = () => {
        this.heatmapLong.setMap(null);
        this.heatmapLong = null;
        this.previousHeatmapLong = null;

        this.heatmapAverage.setMap(null);
        this.heatmapAverage = null;
        this.previousHeatmapAverage = null;

        this.heatmapShort.setMap(null);
        this.heatmapShort = null;
        this.previousHeatmapShort = null;

        for (let marker of this.markers) {
            marker.setMap(null);
        }
    }

    /**
     * Calculates the corresponding cell. TEST ME
     *
     * @param      {<type>}  commute     The commute time
     * @param      {<type>}  cellSize  The cell size
     * @param      {<type>}  bounds    The bounds
     * @return     {Array}   The corresponding cell.
     */
     calculateCorrespondingCell = (commute, cellSize, bounds, gridSize) => {
        const topLeftCoordinates = {
            latitude: bounds.getNorthEast().lat(),
            longitude: bounds.getSouthWest().lng(),
        };
        const distanceFromTopLeft = {
            // Absolute value since latitude of commute will be smaller than the latitude of the top left corner
            height: Math.abs(commute.location.latitude - topLeftCoordinates.latitude),
            width: Math.abs(commute.location.longitude - topLeftCoordinates.longitude),
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

    buildGrid = (commuteData, map) => {
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
        console.log(bounds);
        for (let row of grid.keys()) {
            for (let column of grid[row].keys()) {
                grid[row][column].cellCenterCoordinates = {
                    latitude: bounds.getNorthEast().lat() - (row * cellSize.height + (cellSize.height / 2)),
                    longitude: column * cellSize.width + (cellSize.width / 2) + bounds.getSouthWest().lng(),
                }
            }
        }
        for (let commute of commuteData) {
                // Determine grid cell for commute
                const gridCell = this.calculateCorrespondingCell(commute, cellSize, bounds, gridSize);
                grid[gridCell[0]][gridCell[1]].cellData.push(commute);

        }
        return grid;
    }

    processCommuteData = (googleMaps, commuteData, map, callbacks) => {
        if (!commuteData) {
            return [];
        }
        let grid = this.buildGrid(commuteData, map);
        const avgCrimesPerSquareMile = 2;
        let heatmapData = {"Long": [], "Short": [], "Average": []};
        for (let row of grid.keys()) {
            for (let column of grid[row].keys()) {
                    const cellLocation = grid[row][column].cellCenterCoordinates;
                    heatmapData["Average"].push({
                        location: new googleMaps.LatLng(cellLocation.latitude, cellLocation.longitude),
                        weight: 1
                    });

                    for (let commute of commuteData) {

                        if (commute.commuteTime<=10)
                            heatmapData["Short"].push({
                                location: new googleMaps.LatLng(commute.location.latitude, commute.location.longitude),
                                weight: 1
                            });
                        else if (commute.commuteTime>20)         
                            heatmapData["Long"].push({
                                location: new googleMaps.LatLng(commute.location.latitude, commute.location.longitude),
                                weight: 1
                            });
                        else
                            heatmapData["Average"].push({
                                location: new googleMaps.LatLng(commute.location.latitude, commute.location.longitude),
                                weight: 1
                            });


                            const marker = new googleMaps.Marker({
                            position: new googleMaps.LatLng(commute.location.latitude, commute.location.longitude),
                            map: map,
                            information: [
                                {label: 'Commute Time (mins)', value: commute.commuteTime},
                                {label: 'Zip Code', value: commute.zipCode},
                                {label: 'State', value: commute.state},
                                {label: 'County', value: commute.county}
                            ]
                            });
                        marker.addListener('click', () => callbacks.onMarkerClick(marker.information));
                        this.markers.push(marker);
                    }
            
             }
        }
        return heatmapData;
    }

    /**
     * Fetches a commute data from backend server. This should probably be moved to another class
     *
     * @param      {<type>}  bounds  The map boundary information
     * @return     {<type>}  { commute information }
     */
    fetchData = async (bounds) => {
        const response = await server.get('/commute', {
            params: {
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

    updateMap = async (googleMaps, map, callbacks) => {
        const commuteData = await this.fetchData(map.getBounds());
        console.log(commuteData);

        const heatmapData = this.processCommuteData(googleMaps, commuteData, map, callbacks);
        
        this.heatmapLong = new googleMaps.visualization.HeatmapLayer({
            data: heatmapData["Long"],
            radius: 400,
            gradient: [
                'rgba(255, 0, 0, 0)',
                'rgba(255, 0, 0, 1)',
            ]
        });

        this.heatmapAverage = new googleMaps.visualization.HeatmapLayer({
            data: heatmapData["Average"],
            radius: 200,
            gradient: [
                'rgba(255, 255, 0, 0)',
                'rgba(255, 255, 0, 1)',
            ]
        });

        this.heatmapShort = new googleMaps.visualization.HeatmapLayer({
            data: heatmapData["Short"],
            radius: 400,
            gradient: [
                'rgba(0, 255, 0, 0)',
                'rgba(0, 255, 0, 1)',
            ]
        });


        if (this.previousHeatmapLong) {
            this.previousHeatmapLong.setMap(null);
        }
        if (this.previousHeatmapAverage) {
            this.previousHeatmapAverage.setMap(null);
        }
        if (this.previousHeatmapShort) {
            this.previousHeatmapShort.setMap(null);
        }
        this.heatmapLong.setMap(map);
        this.previousHeatmapLong = this.heatmapLong;

        this.heatmapAverage.setMap(map);
        this.previousHeatmapAverage = this.heatmapAverage;

        this.heatmapShort.setMap(map);
        this.previousHeatmapShort = this.heatmapShort;
    }
}
