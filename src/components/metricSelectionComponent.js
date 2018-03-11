import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Label, Segment } from 'semantic-ui-react';
import { filter } from 'lodash';

// This should probably be in a common area
const metricOptions = [
    {
        text: 'Crime',
        value: 'crime',
    },
    {
        text: 'Income',
        value: 'income',
    },
    {
        text: 'Commute',
        value: 'commute',
    },
];
/**
  * Component to allow the user to change the metric type
  * @reactProps {func} onMetricChangeCallback - A callback to trigger when the current selected metric is changed
  */
class MetricSelectionComponent extends Component {
    onMetricChange = (event, data) => {
        // Filter the metricOptions object to find the object that has a matching value for the key 'value'
        const chosenOption = filter(metricOptions, metricOption => metricOption.value === data.value)[0];
        this.props.onMetricChangeCallback(chosenOption.text, data);
    }

    render() {
        return (
            <Segment>
                <Label attached="top">Metric</Label>
                <Dropdown placeholder="Select Metric" fluid selection options={metricOptions} onChange={this.onMetricChange} />
            </Segment>
        );
    }
}

MetricSelectionComponent.propTypes = {
    onMetricChangeCallback: PropTypes.func.isRequired,
};

export default MetricSelectionComponent;
