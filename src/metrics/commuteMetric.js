import Qs from 'qs'
import server from '../services/server'

/*
// These can and probably should be moved to their own file
const lengthOfLatitudeDegreeAtEquator = 69.172;

function convertToRadians(degreeValue) {
    return (degreeValue * Math.PI) / 180;
}
*/

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

        this.rubic = {"Max": null, "Min": null, "Avg": null, "Short": null, "Long": null};
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

    
    fillGrid = (commuteData, map) => {
        const squareMilesPerCell = 0.5;
        let gridInfo = buildGrid(map, squareMilesPerCell);   
    
        for (let commute of commuteData) {
            // Determine grid cell for commute
            const gridCell = calculateCorrespondingCell(commute.location, gridInfo.metaData.cellSize, map.getBounds(), gridInfo.metaData.gridSize);
            gridInfo.grid[gridCell[0]][gridCell[1]].cellData.push(commute.location);

    }
    
        return gridInfo.grid;
    }

    
    processCommuteData = (googleMaps, commuteData, map, callbacks) => {
        if (!commuteData) {
            return [];
        }
        let grid = this.fillGrid(commuteData, map);
    
        let heatmapData = {"Long": [], "Short": [], "Average": []};
        for (let row of grid.keys()) {
            for (let column of grid[row].keys()) {
                    const cellLocation = grid[row][column].cellCenterCoordinates;
                    heatmapData["Average"].push({
                        location: new googleMaps.LatLng(cellLocation.latitude, cellLocation.longitude),
                        weight: 1
                    });
            }
        }
    
        let short= this.rubic.Short;
        let long= this.rubic.Long

        for (let commute of commuteData) {

            console.log(short + ' ' + long + ' ' +commute.commuteTime);

            if (commute.commuteTime<=short)
                heatmapData["Short"].push({
                    location: new googleMaps.LatLng(commute.location.latitude, commute.location.longitude),
                    weight: 1
                });
            else if (commute.commuteTime>long)         
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
                {label: 'Legend', value: 'Max: ' + parseInt(this.rubic["Max"]*10,10)/10
                                      + ' Min: ' + parseInt(this.rubic["Min"]*10,10)/10
                                      + ' Average: ' + parseInt(this.rubic["Avg"]*10,10)/10 
                                      + ' Long: ' + parseInt(this.rubic["Long"]*10,10)/10
                                     + ' Short: ' + parseInt(this.rubic["Short"]*10,10)/10 },
                {label: 'Zip Code', value: commute.zipCode},
                {label: 'State', value: commute.state},
                {label: 'County', value: commute.county},
            ]
            });
            marker.addListener('click', () => callbacks.onMarkerClick(marker.information));
            this.markers.push(marker);
    }

        return heatmapData;
    }


    calcRubic = async (commuteData) => {

        let max=0;
        let min=999999999999;
        let avg=0;
        let sum=0
        let cnt=0; 
        for (let commute of commuteData) {
            if (commute.commuteTime<min && commute.commuteTime>0) min=commute.commuteTime; //dont use zeros (bad data)
            if (commute.commuteTime>max) max=commute.commuteTime;
            sum = Number(sum) + Number(commute.commuteTime) ;
            cnt++;
            avg=sum/cnt;
        }

        this.rubic['Max'] = max;
        this.rubic['Min'] = min;
        this.rubic['Avg'] = avg;
        this.rubic['Short'] = Number(min)+Number(avg-min)/2;
        this.rubic['Long'] = Number(max)-Number(max-avg)/2;
        console.log(this.rubic)
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

        this.calcRubic(commuteData);

        const heatmapData = this.processCommuteData(googleMaps, commuteData, map, callbacks);
        

        this.heatmapLong = new googleMaps.visualization.HeatmapLayer({
            data: heatmapData["Long"],
            radius: 400,
            gradient: [
                'rgba(255, 0, 0, 0)',
                'rgba(255, 0, 0, 0.75)',
           ]
        });

        this.heatmapAverage = new googleMaps.visualization.HeatmapLayer({
            data: heatmapData["Average"],
            radius: 400,
            gradient: [
                'rgba(255, 255, 0, 0)',
                'rgba(255, 255, 0, 0.75)',
            ]
        });
    
        this.heatmapShort = new googleMaps.visualization.HeatmapLayer({
            data: heatmapData["Short"],
            radius: 400,
            gradient: [
                'rgba(0, 255, 0, 0)',
                'rgba(0, 255, 0, 0.75)',
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

        this.heatmapAverage.setMap(map);
        this.previousHeatmapAverage = this.heatmapAverage;

        this.heatmapShort.setMap(map);
        this.previousHeatmapShort = this.heatmapShort;

        this.heatmapLong.setMap(map);
        this.previousHeatmapLong = this.heatmapLong;
    }
}
