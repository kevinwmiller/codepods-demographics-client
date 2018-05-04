import crimeMetric from './crimeMetric';
import commuteMetric from './commuteMetric';
import incomeMetric from './incomeMetric';

const apiEndpoints = {
    crime: crimeMetric,
    //income: incomeMetric,
    //commute: commuteMetric
};

export fetchMetricData = async (metricName, bounds) => {
    if (apiEndpoints[this.state.metricName]) {
        console.log(`No fetch function for ${this.state.metricName}`);
        return null;
    }
    try {
        const metricData = await (apiEndpoints[this.state.metricName])(bounds);
        return metricData.data.response;
    } catch(err) {
        return [];
    }
}

