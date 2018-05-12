import CrimeMetric from './crimeMetric';
import CommuteMetric from './commuteMetric';

const crimeMetric = new CrimeMetric();
const commuteMetric = new CommuteMetric();
/**
 * Class for metric.
 *
 * @class      Metric (name)
 */
export default class {
    constructor() {
        this.metricProcessors = {
            crime: crimeMetric,
            // income: this.notImplemented,
            commute: commuteMetric
        }
    }

    clearData = (metricName) => {
        if (metricName in this.metricProcessors) {
            this.metricProcessors[metricName].clearData();
        }
        else {
            // throw new Error(`Invalid metric name ${metricName}`)
        }
    }

    fetchData = async (metricName, bounds) => {
        if (metricName in this.metricProcessors) {
            return await this.metricProcessors[metricName].fetchData(bounds);
        }
        else {
            // throw new Error(`Invalid metric name ${metricName}`)
        }
    }

    updateMap = (googleMaps, metricName, map, callbacks) => {
        if (metricName in this.metricProcessors) {
            this.metricProcessors[metricName].updateMap(googleMaps, map, callbacks);
        }
        else {
            // throw new Error(`Invalid metric name ${metricName}`)
        }
    }
}
