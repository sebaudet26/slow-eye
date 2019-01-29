import React from 'react';
import { Helmet } from 'react-helmet';
import {
  concat, takeWhile, pipe, prop, uniq, map, filter,
} from 'ramda';
import DraftTable from '../../components/Table/DraftTable';
import PositionFilter from '../../components/Filter/position';
import YearFilter from '../../components/Filter/year';
import RoundFilter from '../../components/Filter/round';
import TeamFilter from '../../components/Filter/team';
import NationalityFilter from '../../components/Filter/nationality';
import FilterIcon from '../../images/filter.svg';
import './style.scss';

export default class StandingsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      yearSelected: 2018,
      posSelected: 'S',
      natSelected: '',
      roundSelected: '',
    };
    this.handlePosChange = this.handlePosChange.bind(this);
    this.handleNatChange = this.handleNatChange.bind(this);
    this.handleYearChange = this.handleYearChange.bind(this);
    this.handleRoundChange = this.handleRoundChange.bind(this);
  }

  handleRoundChange(target) {
    this.setState({ roundSelected: target.value });
  }

  handleYearChange(target) {
    const { fetchDraft } = this.props;
    fetchDraft(target.value);
    this.setState({ yearSelected: target.value });
  }

  handleNatChange(target) {
    this.setState({ natSelected: target.value });
  }

  handlePosChange(target) {
    this.setState({ posSelected: target.value });
  }

  handleNatChange(target) {
    this.setState({ natSelected: target.value });
  }

  componentWillMount() {
    const { fetchDraft } = this.props;
    const { yearSelected } = this.state;
    fetchDraft(yearSelected);
  }

  filterToggle() {
    document.querySelector('.filters').classList.toggle('active');
  }

  render() {
    const { drafts } = this.props;
    const {
      posSelected, yearSelected, natSelected, roundSelected,
    } = this.state;
    const draft = drafts[yearSelected];
    console.log('state', this.state);
    const filters = {
      posSelected,
      natSelected,
      roundSelected,
    };
    const rounds = pipe(
      map(prop('round')),
      uniq,
      map(round => ({ value: round, label: round })),
      concat([{ value: '', label: 'All' }]),
    )(draft || []);
    console.log(roundSelected);
    console.log('draft', draft);
    return (
      <div className="draft-page">
        <Helmet>
          <title>Draft</title>
          <meta
            name="description"
            content="Draft"
          />
        </Helmet>
        <h2>{`${yearSelected} NHL Draft`}</h2>
        <div className="filter-toggle" onClick={this.filterToggle}>
          <img src={FilterIcon} alt="Filter Icon" />
          Show/Hide Filters
        </div>
        <div className="filters">
          <YearFilter selected={yearSelected} onChange={this.handleYearChange} />
          <RoundFilter selected={roundSelected} onChange={this.handleRoundChange} options={rounds} />
          <PositionFilter selected={posSelected} onChange={this.handlePosChange} />
          <NationalityFilter selected={natSelected} onChange={this.handleNatChange} />
        </div>
        <DraftTable round={roundSelected} draft={draft} filters={filters} />
      </div>
    );
  }
}
