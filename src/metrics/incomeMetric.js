import Qs from 'qs';
import server from '../services/server';
import geometry_dict from '../map/maryssdict';

export default class {
    constructor() {
        this.incomeData = null;
        this.polygons = [];
    }

    clearData = () => {
        this.incomeData = null;
        this.polygons = [];
    }

    fetchData = async(bounds) => {
        const counties = await server.get('/county', { 
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
            paramsSerializer: function(params) { 
                console.log("Response", Qs.stringify(params, {arrayFormat: 'brackets'})); 
                return Qs.stringify(params, {arrayFormat: 'brackets'}); 
            }, 
        });         
	this.incomeData = await server.get('/income');
	for (let i = 0; i < counties.length; ++i) {
            console.log("county " + i + ": " + counties[i]);	
	}
	return counties
    }

    updateMap = async (googleMaps, map, callbacks) => {
        console.log("bounds: " + map.getBounds());
        const counties = await this.fetchData(map.getBounds());
        console.log("response: ")
        console.log(counties);
	if (counties.data.response.length === 0) {
            console.log("inside a county, two counties needed for comparison");
		//figure out if we are zoomd inside a given county. 
	}else{
           console.log(this.incomeData);
	   const incD = this.incomeData.data.response[0]; // this is a dict
           const incomeData_dict = []
           for (let i = 0; i < counties.data.response.length; ++i) { // for each key (county) in dict
               // debugging code
               
               console.log("name: " + counties.data.response[i]);
               console.log("income: " + incD[counties.data.response[i]]);
               const path = geometry_dict[counties.data.response[i]].coordinates;
               var strokeColor = '#000000';
               var fillColor = null;
	       if (incD[counties.data.response[i]] < 45000) {
	           fillColor = '#FF0000';
	       } else if (incD[counties.data.response[i]] >= 45000 && incD[counties.data.response[i]] < 60000) {
                   fillColor = '#FFFF00'
	       } else if (incD[counties.data.response[i]] >=60000) {
                   fillColor = '#00FF00'
	       }
	       var strokeOpacity = .8;
               var strokeWeight = 2;
               var fillOpacity = .25;
               console.log(incomeData_dict);
               const params = {
               map,
               path,
               strokeColor,
	       strokeOpacity,
               strokeWeight,
               fillColor,
               fillOpacity
               
	       };
               const polygon = new googleMaps.Polygon(params);
	       polygon.setMap(map);
               this.polygons.push(polygon);
	   }
	           


	}
	
        	
    }
    processIncomeData = () => {
       
    }
}
