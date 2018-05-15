import Qs from 'qs';
import server from '../services/server';

const buildGrid =  require('../map/grid').buildGrid;
const calculateCorrespondingCell = require('../map/grid').calculateCorrespondingCell;
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

    fillGrid = (crimeData, map) => {
        const squareMilesPerCell = 0.5;
        let gridInfo = buildGrid(map, squareMilesPerCell);
        for (let agency of crimeData) {
            for (let crime of agency.crimes) {
                // Determine grid cell for crime
                const gridCell = calculateCorrespondingCell(crime.location, gridInfo.metaData.cellSize, map.getBounds(), gridInfo.metaData.gridSize);
                gridInfo.grid[gridCell[0]][gridCell[1]].cellData.push(crime);
            }
        }
        return gridInfo.grid;
    }

    processCrimeData = (googleMaps, crimeData, map, callbacks) => {
        if (!crimeData) {
            return [];
        }
        let grid = this.fillGrid(crimeData, map);
        // const avgCrimesPerSquareMile = 2;
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

                if (numViolent === 0 && numNonViolent === 0) {
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
        console.log(heatmapData);
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
                'rgba(0, 255, 0, 0.75)',
            ]
        });

        this.heatmapNonViolent = new googleMaps.visualization.HeatmapLayer({
            data: heatmapData["NonViolent"],
            radius: 200,
            gradient: [
                'rgba(255, 255, 0, 0)',
                'rgba(255, 255, 0, 0.75)',
            ]
        });

        this.heatmapViolent = new googleMaps.visualization.HeatmapLayer({
            data: heatmapData["Violent"],
            radius: 200,
            gradient: [
                'rgba(255, 0, 0, 0)',
                'rgba(255, 0, 0, 0.75)',
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
