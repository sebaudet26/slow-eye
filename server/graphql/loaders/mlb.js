const { map, pathOr, propOr } = require('ramda')

const ApiRequest = require('../../libs/api/api')
const DataLoader = require('dataloader')

const batchTeamsFetcher = async (seasons) => {
	const data = await Promise.all(seasons.map((season) => {
		return new ApiRequest({
			league: 'MLB',
			apiType: 'LOOKUP',
			resource: `/named.team_all_season.bam?sport_code=%27mlb%27&all_star_sw=%27N%27&season=%27${season}%27&sort_order=name_asc`,
		}).fetch()
	}))

  return map(pathOr([], ['team_all_season', 'queryResults', 'row']), data)
}

const batchTeamsStandingsFetcher = async (seasons) => {
	const data = await Promise.all(seasons.map((season) => {
		return new ApiRequest({
			league: 'MLB',
			apiType: 'BASIC',
			resource: `/standings?leagueId=103,104&season=${season}&standingsTypes=regularSeason&hydrate=division,conference,sport,league`
		}).fetch()
	}))

	return map(pathOr([], ['records']), data)
}

const batchBattingLeadersFetcher = async (seasons) => {
	const data = await Promise.all(seasons.map((season) => {
		return new ApiRequest({
			league: 'MLB',
			apiType: 'LOOKUP',
			resource: `/named.leader_hitting_repeater.bam?season=${season}&sort_order=%27desc%27&sort_column=%27avg%27&stat_type=hitting&page_type=SortablePlayer&game_type=%27R%27&player_pool=QUALIFIER&season_type=ANY&sport_code=%27mlb%27&totalSize=200`,
		}).fetch()
	}))
  
	return map(pathOr([], ['leader_hitting_repeater', 'leader_hitting_mux', 'queryResults', 'row']), data)
}

const batchPitchingLeadersFetcher = async (seasons) => {
	const data = await Promise.all(seasons.map((season) => {
		return new ApiRequest({
			league: 'MLB',
			apiType: 'LOOKUP',
			resource: `/named.leader_pitching_repeater.bam?season=${season}&sort_order=%27asc%27&sort_column=%27era%27&stat_type=pitching&page_type=SortablePlayer&game_type=%27R%27&player_pool=QUALIFIER&season_type=ANY&sport_code=%27mlb%27&totalSize=200`,
		}).fetch()
	}))

  return map(pathOr([], ['leader_pitching_repeater', 'leader_pitching_mux', 'queryResults', 'row']), data)
}

const batchPlayerFetcher = async (players) => {
	const data = await Promise.all(players.map((player) => {
		return new ApiRequest({
			league: 'MLB',
			apiType: 'BASIC',
			resource: `/people/${player}?hydrate=currentTeam,team,stats(type=[yearByYear,yearByYearAdvanced,careerRegularSeason,careerAdvanced,availableStats](team(league)),leagueListId=mlb_hist)&site=en`,
		}).fetch()
	}))

	return map(pathOr([], ['people', 0]), data)
}

module.exports = {
  teamsLoader: new DataLoader(batchTeamsFetcher),
  teamsStandingsLoader: new DataLoader(batchTeamsStandingsFetcher),
  playersBattingLeadersLoader: new DataLoader(batchBattingLeadersFetcher),
  playersPitchingLeadersLoader: new DataLoader(batchPitchingLeadersFetcher),
  playerLoader: new DataLoader(batchPlayerFetcher),
};
