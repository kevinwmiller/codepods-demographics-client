import Qs from 'qs';
import server from '../services/server';

export default class {
    constructor() {

    }

    clearData = () => {
    }

    fetchData = async(bounds) => {
        const response = await server.get('/income', {
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
        return response.data.response
    }

    updateMap = async (googleMaps, map, callbacks) => {
        console.log("bounds: " + map.getBounds());
        const incomeData = await this.fetchData(map.getBounds());
        console.log(incomeData);
        const kmldata = this.processIncomeData(googleMaps, incomeData, map, callbacks);
        const kmllayer = new googleMaps.Data();
	    {/*
        this.highincome = new googleMaps.visualization.KmlLayer({
			    url: server.get('
           
	}

	*/}


    }
    processIncomeData = () => {
        
        
    }
}
