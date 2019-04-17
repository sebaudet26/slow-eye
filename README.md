Made with ❤️


NHL API
https://github.com/dword4/nhlapi

TODO:

----------V1----------

- ~~rookies vs veterans into players table~~
- ~~merge in goalies stats from the history for players page~~
- ~~merge in goalies bios from the history for search bar~~
- ~~load teams from API into the team selector in players page~~
- ~~draft page~~
- ~~score carousel~~
- ~~game summaries~~

----------V2----------

- ~~video~~
- ~~home page~~
- Game Page When game isn't started (show matchup)
- Leaders Page for Mobile
- Add Tabs to Standings Page (Playoff Picture, Wild Card Tab, League Tab, Conference Tab)
- Put Player Stats and Team Stats under Stats dropdown
- Beautify Footer
- Algorithm for Hot Players and Power Rankings
- Schedule Page, Schedule Tab for Team page
- 3 stars to game page
- Standings history
- Team stats history
- Team page for any season
- Player Contracts


----------Other Ideas----------

- Line Combinations
- Corsica Ratings for Players, Advanced Stats
- Starting Lineups
- Starting Goalies

Playoffs
https://statsapi.web.nhl.com/api/v1/schedule?startDate=2019-04-10&endDate=2019-04-10&hydrate=game(seriesSummary),seriesSummary(series)

----------MLB v0----------

Score Page
https://statsapi.mlb.com/api/v1/schedule?sportId=1,51&date=2019-04-11&hydrate=team(leaders(showOnPreview(leaderCategories=[homeRuns,runsBattedIn,battingAverage],statGroup=[pitching,hitting]))),linescore(matchup,runners),flags,liveLookin,review,broadcasts(all),decisions,person,probablePitcher,stats,homeRuns,previousPlay,game(content(media(featured,epg),summary),tickets),seriesStatus(useOverride=true)&leagueId=103,104,420

Standings Page
https://statsapi.mlb.com/api/v1/standings?leagueId=103,104&season=2019&standingsTypes=regularSeason,springTraining,firstHalf,secondHalf&hydrate=division,conference,sport,league,team(nextSchedule(team,gameType=[R,F,D,L,W,C],inclusive=false),previousSchedule(team,gameType=[R,F,D,L,W,C],inclusive=true))
