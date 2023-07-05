import React, { useEffect, useState } from "react";
import moment from "moment";
import { Header } from "./Components/Header/Header";
import "./App.css";
import axios from "axios";

const App = () => {
  const [currentDate, setCurrentDate] = useState(moment().format("MM-DD-YYYY"));
  const [nextSevenDays, setNextSevenDays] = useState([]);
  const [matchList, setMatchList] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);

  useEffect(() => {
    calculateNextSevenDays();
  }, []);

  useEffect(() => {
    axios
      .get(`http://cms.bettorlogic.com/api/BetBuilder/GetFixtures?sports=1`)
      .then((res) => {
        const convertedDate = res.data.map((match) => {
          const localDate = moment
            .utc(match.MatchDate)
            .local()
            .format("MM-DD-YYYY");
          return { ...match, MatchDate: localDate };
        });
        setMatchList(convertedDate);
        setFilteredMatches(convertedDate);
      })
      .catch((err) => console.log(err));
  }, []);

  const calculateNextSevenDays = () => {
    const calculateNextSevenDays = [];

    for (let i = 0; i < 7; i++) {
      const nextDay = moment(currentDate).add(i, "days").format("MM-DD-YYYY");
      calculateNextSevenDays.push(nextDay);
    }
    setNextSevenDays(calculateNextSevenDays);
  };

  const clickHandler = (e) => {
    //format date to match api date format and filter matchList by date clicked on
    try {
      const date = moment(e.target.innerText, "ddd DD MMM").format(
        "MM-DD-YYYY"
      );
      const filteredMatches = matchList.filter(
        (match) => match.MatchDate === date
      );
      setFilteredMatches(filteredMatches);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Header />
      <div className="dates">
        {nextSevenDays.map((date, index) => (
          <div key={index} className="date" onClick={clickHandler}>
            {moment(date).format("ddd DD MMM")}
          </div>
        ))}
      </div>

      <div className="matchList">

        {filteredMatches.map((match, index) => (
          <div key={index} className="match">
            <div className="Country">{match.Country}</div>
            <div className="matchTime">{match.MatchDate}</div>
            <div className="matchTime">{match.MatchTime}</div>
            <div className="matchTeams">
              {match.Team1Name} - {match.Team2Name}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default App;
