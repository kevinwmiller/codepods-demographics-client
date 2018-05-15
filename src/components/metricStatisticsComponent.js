import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import red from '../red-legend.png';
// import green from '../green-legend.png'
// import yellow from '../yellow-legend.png'


import { Segment } from 'semantic-ui-react';

/**
  * // 
  * Displays information about the selected metric for the given area
  * @reactProps {object} metricStatistics - The metric data to display
  */
class MetricStatisticsComponent extends Component {
    render() {

        // // Set up the legend
        // var badInfo = "";
        // var middleInfo = "";
        // var goodInfo = "";

        // These should be in the corresponding metrics classes. The marker.information key can be set to contain this information
        // // Set up legend based on which statistic is used
        // if (this.props.metricStatistics.metricLabel === "Crime") {
        //     badInfo = "Violent Crime";
        //     middleInfo = "Non-Violent Crime";
        //     goodInfo = "No Crime";
        // } else if (this.props.metricStatistics.metricLabel === "Income") {
        //     badInfo = "Below 49,999$";
        //     middleInfo = "Between 50,000$ and 99,999$";
        //     goodInfo = "Above 100,000$";
        // } else if (this.props.metricStatistics.metricLabel === "Commute") {
        //     badInfo = "Over an Hour";
        //     middleInfo = "Thirty Minutes to an Hour";
        //     goodInfo = "Less than Thirty Minutes";
        // }

        return (
            <Segment>
                {
                    this.props.metricStatistics.metricLabel ?
                        <h2 className="ui header">
                            {this.props.metricStatistics.metricLabel} Statistics
                        </h2>
                        : <h3> Statistics </h3>
               }
               {
                    this.props.metricStatistics.metricInfo ?
                        <h3 className="ui menu">
                            <ul className="metricInfo">
                                {this.props.metricStatistics.metricInfo.map((info) =>
                                    <li className="metricInfoItem">{info.label}: {info.value}</li>
                                )}
                            </ul>
                        </h3>
                        : ""
                }
            </Segment>
        );
    }
}

// This will change once we figure out the format of the server response
MetricStatisticsComponent.propTypes = {
    metricStatistics: PropTypes.shape({
        metricLabel: PropTypes.string.isRequired,
        metricName: PropTypes.string.isRequired,
        metricInfo: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.string
        })),
    }).isRequired,
};

export default MetricStatisticsComponent;
