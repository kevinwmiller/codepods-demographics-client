import Qs from 'qs';
import server from '../services/server';
import geometry_dict from '../map/maryssdict';
export default class {
    constructor() {
        this.incomeData = null;
    }

    clearData = () => {
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
        return counties;
    }

    updateMap = async (googleMaps, map, callbacks) => {
        console.log("bounds: " + map.getBounds());
        const countyData = await this.fetchData(map.getBounds());
        console.log("response: ")
        console.log(countyData);
	if (countyData.data.response.length === 0) {
            console.log("inside a county, two counties needed for comparison");
		//figure out if we are zoomd inside a given county. 
	}else{
           console.log(this.incomeData);
	   const incD = this.incomeData.data.response[0]; // this is a dict
           const incomeData_dict = []
           for (let i = 0; i < countyData.data.response.length; ++i) { // for each key (county) in dict
               console.log("name: " + countyData.data.response[i]);
               console.log("income: " + incD[countyData.data.response[i]]); // 
//               console.log(
               console.log("coordinates: " + geometry_dict[countyData.data.response[i]].coordinates);
               incomeData_dict.push({
                  key: countyData.data.response[i],
                  value:[
		     incD[countyData.data.response[i]],
		     geometry_dict[countyData.data.response[i]].coordinates,
		  ],
	       });
	   }
//           incomeData_dict.



	}
	
        	
    }
    processIncomeData = () => {
       
    }
}
