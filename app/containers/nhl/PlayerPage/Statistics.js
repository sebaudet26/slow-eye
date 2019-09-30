import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import CareerStatsTable from '../../../components/Table/CareerStatsTable';
import GameLogTable from '../../../components/Table/GameLogTable';
import { saveToLS, getFromLS } from '../../../utils/localStorage';

const urlParams = new URLSearchParams(window.location.search);

class Statistics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { internationalStats, careerPlayoffStats, proStats, logs, isPro, info } = this.props;
    if (!internationalStats.length && !logs.length) {
      return (
        <div className="container">
          <h3>Season Stats</h3>
          <CareerStatsTable stats={proStats} info={info} showTotalRow={isPro} />
          <h3>Playoff Stats</h3>
          <CareerStatsTable stats={careerPlayoffStats} info={info} showTotalRow={isPro} />
        </div>
      );
    }
    return (
      <Tabs
        defaultIndex={Number(getFromLS(`playerTabIndex${urlParams.get('id')}`)) || 0}
        onSelect={i => saveToLS(`playerTabIndex${urlParams.get('id')}`, i)}
      >
      <TabList>
        <div className="container">
          <Tab>Career Stats</Tab>
          {internationalStats.length && <Tab>International</Tab>}
          {logs.length && <Tab>Game Logs</Tab>}
        </div>
      </TabList>
      <div className="container">
        {proStats.length && (
          <TabPanel>
          <h3>Season Stats</h3>
          <CareerStatsTable stats={proStats} info={info} showTotalRow={isPro} />
          {careerPlayoffStats.length && (
            <div>
            <h3>Playoff Stats</h3>
            <CareerStatsTable stats={careerPlayoffStats} info={info} showTotalRow={isPro} />
            </div>
          )}
          </TabPanel>
        )}
        {internationalStats.length && (
          <TabPanel>
          <h3>International</h3>
          <CareerStatsTable stats={internationalStats} info={info} showTotalRow />
          </TabPanel>
        )}
        {logs.length && (
          <TabPanel>
          <h3>Game Logs</h3>
          <GameLogTable logs={logs} info={info} />
          </TabPanel>
        )}
      </div>
      </Tabs>
    );
  }
}

export default Statistics;
