import React from 'react';
import { Helmet } from 'react-helmet';
import DraftTable from '../../components/Table/DraftTable';
import PositionFilter from '../../components/Filter/position';
import './style.scss';

export default class StandingsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedYear: 2018,
      posSelected: 'S',
    };
    this.handlePosChange = this.handlePosChange.bind(this);
  }

  handlePosChange(target) {
    this.setState({ posSelected: target.value });
  }

  componentWillMount() {
    const { fetchDraft } = this.props;
    const { selectedYear } = this.state;
    fetchDraft(selectedYear);
  }

  render() {
    const { drafts } = this.props;
    const { posSelected, selectedYear } = this.state;
    const draft = drafts[selectedYear];
    console.log(draft);
    const filters = {
      posSelected,
    };
    console.log(filters);
    return (
      <div className="draft-page">
        <Helmet>
          <title>Draft</title>
          <meta
            name="description"
            content="Draft"
          />
        </Helmet>
        <h2>{`Draft ${selectedYear}`}</h2>
        <PositionFilter selected={posSelected} onChange={this.handlePosChange} />
        <DraftTable draft={draft} filters={filters} />
      </div>
    );
  }
}
