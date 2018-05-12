import Qs from 'qs'
import server from '../services/server'

// These can and probably should be moved to their own file
const lengthOfLatitudeDegreeAtEquator = 69.172;

function convertToRadians(degreeValue) {
    return (degreeValue * Math.PI) / 180;
}

/**
 * Class for commute metric.
 *
 * @class      CommuteMetric (name)
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

/*
    processCommuteData = (googleMaps, commuteData, map, callbacks) => {
        if (!commuteData) {
            return [];
        }
        let grid = this.buildGrid(commuteData, map);
        const avgCrimesPerSquareMile = 2;
        let heatmapData = [];
        for (let row of grid.keys()) {
            for (let column of grid[row].keys()) {
                    const cellLocation = grid[row][column].cellCenterCoordinates;
                    heatmapData.push({
                        location: new googleMaps.LatLng(cellLocation.latitude, cellLocation.longitude),
                        weight: 1
                    });
                    // Add a markers for crimes
                    for (let commute of commuteData) {

                      // Determine grid cell for commute
                            const marker = new googleMaps.Marker({
                                position: new googleMaps.LatLng(commute.location.latitude, commute.location.longitude),
                                map: map,
                                information: [
                                    {label: 'Zip Code', value: commute.zipCode},
                                    {label: 'Commute Time', value: commute.commuteTime},
                                ],
                            });
                            marker.addListener('click', () => callbacks.onMarkerClick(marker.information));
           
                    }

             }
        }
        return heatmapData;
    }
*/

    processCommuteData = (googleMaps, commuteData, map, callbacks) => {
        if (!commuteData) {
            return [];
        }

        let heatmapData = [];

        for (let commute of commuteData) {

            heatmapData.push({
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
        this.heatmap = new googleMaps.visualization.HeatmapLayer({
            data: heatmapData,
            radius: 90,
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
