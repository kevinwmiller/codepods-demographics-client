import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';

/**
  * Displays information about the selected metric for the given area
  * @reactProps {object} metricStatistics - The metric data to display
  */
class MetricStatisticsComponent extends Component {
    render() {
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
                            {this.props.metricStatistics.metricInfo}
                        </h3>
                        : <h3> Data </h3>
               
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
