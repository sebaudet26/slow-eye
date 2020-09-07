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
    const {
      proStats,
      playoffStats,
      internationalStats,
      logs,
      isPro,
      position,
     } = this.props;
    console.log('statistics', this.props)
    if (!internationalStats.length && !logs.length) {
      return (
        <div className="container">
          <h3>Season Stats</h3>
          <CareerStatsTable stats={proStats} position={position} showTotalRow={isPro} />
          <h3>Playoff Stats</h3>
          <CareerStatsTable stats={playoffStats} position={position} showTotalRow={isPro} />
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
          <CareerStatsTable stats={proStats} position={position} showTotalRow={isPro} />
          {playoffStats.length && (
            <div>
            <h3>Playoff Stats</h3>
            <CareerStatsTable stats={playoffStats} position={position} showTotalRow={isPro} />
            </div>
          )}
          </TabPanel>
        )}
        {internationalStats.length && (
          <TabPanel>
          <h3>International</h3>
          <CareerStatsTable stats={internationalStats} position={position} showTotalRow />
          </TabPanel>
        )}
        {logs.length && (
          <TabPanel>
          <h3>Game Logs</h3>
          <GameLogTable logs={logs} position={position} />
          </TabPanel>
        )}
      </div>
      </Tabs>
    );
  }
}

export default Statistics;
