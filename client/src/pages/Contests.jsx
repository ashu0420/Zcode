import { useEffect, useState } from "react";

function Contests() {
  const [contests, setContests] = useState([]);

  useEffect(() => {
    const fetchContest = async () => {
      const res = await fetch("https://codeforces.com/api/contest.list?gym=false");
      const data = await res.json();

      const upcoming = data.result.filter(c => c.phase === "BEFORE");
      setContests(upcoming);
    };

    fetchContest();
  }, []);
  const day = 24 * 60 * 60;
  return (
    <div>
      <h3>Upcoming contests</h3>
      {contests.map(c => (
        <div key={c.id}>{c.name} {"->"} {c.relativeTimeSeconds/day} days </div>
      ))}
    </div>
  );
}

export default Contests;