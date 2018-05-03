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
                        : null
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
    }).isRequired,
};

export default MetricStatisticsComponent;
