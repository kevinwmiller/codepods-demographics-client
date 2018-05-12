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
        this.previousHeatmapViolent = null;
        this.previousHeatmapNonViolent = null;
        this.previousHeatmapNoCrime = null;
        this.markers = [];
    }

    clearData = () => {
        this.heatmapViolent.setMap(null);
        this.heatmapViolent = null;
        this.previousHeatmapViolent = null;

        this.heatmapNonViolent.setMap(null);
        this.heatmapNonViolent = null;
        this.previousHeatmapNonViolent = null;

        this.heatmapNoCrime.setMap(null);
        this.heatmapNoCrime = null;
        this.previousHeatmapNoCrime = null;
        for (let marker of this.markers) {
            marker.setMap(null);
        }
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
        console.log(bounds);
        for (let row of grid.keys()) {
            for (let column of grid[row].keys()) {
                grid[row][column].cellCenterCoordinates = {
                    latitude: bounds.getNorthEast().lat() - (row * cellSize.height + (cellSize.height / 2)),
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
        let heatmapData = {"Violent": [], "NonViolent": [], "NoCrime": []};
        for (let row of grid.keys()) {
            for (let column of grid[row].keys()) {
                    const cellLocation = grid[row][column].cellCenterCoordinates;

                    let numViolent = 0;
                    let numNonViolent = 0;

                    for (let i = 0; i < grid[row][column].cellData.length; i++) {
                        if (grid[row][column].cellData[i].categorization.category === "violent") {
                            numViolent += 1;
                        } else {
                            numNonViolent += 1;
                        }
                    }

                    if (numViolent == 0 && numNonViolent == 0) {
                        heatmapData["NoCrime"].push({
                            location: new googleMaps.LatLng(cellLocation.latitude, cellLocation.longitude),
                            weight: 1
                        });
                    } else if (numViolent >= numNonViolent) {
                        heatmapData["Violent"].push({
                            location: new googleMaps.LatLng(cellLocation.latitude, cellLocation.longitude),
                            weight: 1
                        });
                    } else {
                        heatmapData["NonViolent"].push({
                            location: new googleMaps.LatLng(cellLocation.latitude, cellLocation.longitude),
                            weight: 1
                        });
                    }

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
                            this.markers.push(marker);
                        }
                    }
            }
        }
        return heatmapData;
    }

    /**
     * Fetches a crime data from backend server. This should probably be moved to another class
     *
     * @param      {<type>}  bounds  The map boundary information
     * @return     {<type>}  { crime information }
     */
    fetchData = async (bounds) => {
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

    updateMap = async (googleMaps, map, callbacks) => {
        const crimeData = await this.fetchData(map.getBounds());
        console.log(crimeData);
        const heatmapData = this.processCrimeData(googleMaps, crimeData, map, callbacks);

        this.heatmapNoCrime = new googleMaps.visualization.HeatmapLayer({
            data: heatmapData["NoCrime"],
            radius: 200,
            gradient: [
                'rgba(0, 255, 0, 0)',
                'rgba(0, 255, 0, 1)',
            ]
        });

        this.heatmapNonViolent = new googleMaps.visualization.HeatmapLayer({
            data: heatmapData["NonViolent"],
            radius: 200,
            gradient: [
                'rgba(255, 255, 0, 0)',
                'rgba(255, 255, 0, 1)',
            ]
        });

        this.heatmapViolent = new googleMaps.visualization.HeatmapLayer({
            data: heatmapData["Violent"],
            radius: 200,
            gradient: [
                'rgba(255, 0, 0, 0)',
                'rgba(255, 0, 0, 1)',
            ]
        });

        if (this.previousHeatmapNoCrime) {
            this.previousHeatmapNoCrime.setMap(null);
        }
        if (this.previousHeatmapNonViolent) {
            this.previousHeatmapNonViolent.setMap(null);
        }
        if (this.previousHeatmapViolent) {
            this.previousHeatmapViolent.setMap(null);
        }

        this.heatmapNoCrime.setMap(map);
        this.previousHeatmapNoCrime = this.heatmapNoCrime;
        
        this.heatmapNonViolent.setMap(map);
        this.previousHeatmapNonViolent = this.heatmapNonViolent;

        this.heatmapViolent.setMap(map);
        this.previousHeatmapViolent = this.heatmapViolent;



    }
}
