import React from 'react';
import { Helmet } from 'react-helmet';
import {
  concat,
  filter,
  length,
  map,
  path,
  pipe,
  prop,
  propEq,
  sortBy,
  takeWhile,
  uniqBy,
  uniq,
} from 'ramda';
import DraftTable from '../../components/Table/DraftTable';
import PositionFilter from '../../components/Filter/position';
import YearFilter from '../../components/Filter/year';
import RoundFilter from '../../components/Filter/round';
import TeamFilter from '../../components/Filter/team';
import { getFromLS, saveToLS } from '../../utils/localStorage';
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
      teamSelected: '',
      ...JSON.parse(getFromLS('draftFilters') || '{}'),
    };
    this.handlePosChange = this.handlePosChange.bind(this);
    this.handleNatChange = this.handleNatChange.bind(this);
    this.handleYearChange = this.handleYearChange.bind(this);
    this.handleRoundChange = this.handleRoundChange.bind(this);
    this.handleTeamChange = this.handleTeamChange.bind(this);
  }

  componentDidUpdate() {
    saveToLS('draftFilters', JSON.stringify(this.state));
  }

  handleRoundChange(target) {
    this.setState({ roundSelected: target.value });
  }

  handleTeamChange(target) {
    this.setState({ teamSelected: target.value });
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
      posSelected,
      yearSelected,
      natSelected,
      roundSelected,
      teamSelected,
    } = this.state;

    const draft = drafts[yearSelected] || [];

    const filters = {
      posSelected,
      natSelected,
      roundSelected,
      teamSelected,
    };

    const pageLength = pipe(
      takeWhile(propEq('round', 1)),
      length,
    )(draft);

    console.log('pageLength', pageLength);

    const rounds = pipe(
      map(prop('round')),
      uniq,
      sortBy(prop('name')),
      map(round => ({ value: round, label: round })),
      concat([{ value: '', label: 'All' }]),
    )(draft);

    const teams = pipe(
      map(prop('pickedBy')),
      uniqBy(prop('abbreviation')),
      sortBy(prop('name')),
      map(team => ({ value: team.abbreviation, label: team.name })),
      concat([{ value: '', label: 'All' }]),
    )(draft);

    return (
      <div className="draft-page">
        <Helmet>
          <title>Draft</title>
          <meta
            name="description"
            content="View Drafts by Year. Seal Stats is the best place to view NHL stats. User-friendly and fast."
          />
        </Helmet>
        <h2>{`${yearSelected} NHL Draft`}</h2>
        <div className="filter-toggle" onClick={this.filterToggle}>
          <img src={FilterIcon} alt="Filter Icon" />
          Show/Hide Filters
        </div>
        <div className="filters">
          <YearFilter selected={yearSelected} onChange={this.handleYearChange} startYear={1963} />
          <RoundFilter selected={roundSelected} onChange={this.handleRoundChange} options={rounds} />
          <TeamFilter selected={teamSelected} onChange={this.handleTeamChange} options={teams} />
          <PositionFilter selected={posSelected} onChange={this.handlePosChange} enableAllOption />
          <NationalityFilter selected={natSelected} onChange={this.handleNatChange} />
        </div>
        {
          draft
            ? (
              <DraftTable
                round={roundSelected}
                draft={draft}
                filters={filters}
                year={yearSelected}
                pageLength={pageLength}
              />
            )
            : null
        }
      </div>
    );
  }
}
