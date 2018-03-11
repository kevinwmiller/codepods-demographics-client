import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';

// Only require those which are needed in the current component
import MapComponent from './mapComponent';
import MetricSelectionComponent from './metricSelectionComponent';
import MetricStatisticsComponent from './metricStatisticsComponent';

/**
  * The layout component of Codepods Demographics
  */
class CodepodsDemographicsComponent extends Component {
    /**
    * @constructor
    * @param {object} props
    */
    constructor(props) {
        super(props);

        this.state = {
            metricLabel: '',
            metricName: '',
        };
    }

    onMetricChange = (metricLabel, data) => {
        this.setState({
            metricLabel,
            metricName: data.value,
        });
    }
    /**
        Renders the 'message' property, and will also add a person's name returned
            by the express server (Stored in this.state.response  @see {@link getApiData})
    */
    render() {
        return (
            <div>
                <MetricSelectionComponent onMetricChangeCallback={this.onMetricChange} />
                <Grid columns={2} divided>
                    <Grid.Row>
                        <Grid.Column>
                            <MapComponent metricName={this.state.metricName} />
                        </Grid.Column>
                        <Grid.Column>
                            <MetricStatisticsComponent metricStatistics={
                                {
                                    metricLabel: this.state.metricLabel,
                                    metricName: this.state.metricName,
                                    metricValues: [],
                                }}
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}

export default CodepodsDemographicsComponent;
