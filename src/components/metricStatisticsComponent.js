import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';
import red from '../red-legend.png';
import green from '../green-legend.png'
import yellow from '../yellow-legend.png'



/**
  * Displays information about the selected metric for the given area
  * @reactProps {object} metricStatistics - The metric data to display
  */
class MetricStatisticsComponent extends Component {
    render() {

        // Set up the legend
        var badInfo = "";
        var middleInfo = "";
        var goodInfo = "";

        // Set up legend based on which statistic is used
        if (this.props.metricStatistics.metricLabel === "Crime") {
            badInfo = "Violent Crime";
            middleInfo = "Non-Violent Crime";
            goodInfo = "No Crime";
        } else if (this.props.metricStatistics.metricLabel === "Income") {
            badInfo = "Below 49,999$";
            middleInfo = "Between 50,000$ and 99,999$";
            goodInfo = "Above 100,000$";
        } else if (this.props.metricStatistics.metricLabel === "Commute") {
            badInfo = "Over an Hour";
            middleInfo = "Thirty Minutes to an Hour";
            goodInfo = "Less than Thirty Minutes";
        }

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
                        <h3 className="ui header">
                            {this.props.metricStatistics.metricInfo}
                        </h3>
                        : 
                        <div> <h3><img src={red} alt="legend"></img> {badInfo} </h3>
                                <h3><img src={yellow} alt="legend"></img> {middleInfo} </h3>
                                <h3><img src={green} alt="legend"></img> {goodInfo} </h3>
                        </div> 
                        
                }
            </Segment>



        );
    }
}

// This will change once we figure out the format of the server response
MetricStatisticsComponent.propTypes = {
    metricStatistics: PropTypes.shape({
        metricLabel: PropTypes.string.isRequired,
        metricData: PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.number,
        })).isRequired,
        metricInfo: PropTypes.string.isRequired,
    }).isRequired,
};

export default MetricStatisticsComponent;
