import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Segment } from 'semantic-ui-react';

/**
  * // 
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
            value: PropTypes.number,
        })).isRequired,
    }).isRequired,
};

export default MetricStatisticsComponent;
