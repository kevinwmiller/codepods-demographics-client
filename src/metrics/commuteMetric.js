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
        this.markers = [];
    }

    clearData = () => {
        this.heatmap.setMap(null);
        this.heatmap = null;
        this.previousHeatmap = null;
        for (let marker of this.markers) {
            marker.setMap(null);
        }
    }

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
            this.markers.push(marker);
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
