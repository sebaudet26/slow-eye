import React from 'react';
import { Helmet } from 'react-helmet';
import DraftTable from '../../components/Table/DraftTable';
import './style.scss';

export default class StandingsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedYear: 2018,
    };
  }

  componentWillMount() {
    const { fetchDraft } = this.props;
    const { selectedYear } = this.state;
    fetchDraft(selectedYear);
  }

  render() {
    const { drafts } = this.props;
    const { selectedYear } = this.state;
    const draft = drafts[selectedYear];
    console.log(draft);
    return (
      <div className="draft-page">
        <Helmet>
          <title>Draft</title>
          <meta
            name="description"
            content="Draft"
          />
        </Helmet>
        <h2>Draft</h2>
        <DraftTable draft={draft} />
      </div>
    );
  }
}
