// const problems = [
//   { id: 1, title: "Two Sum", difficulty: "Easy" },
//   { id: 2, title: "Binary Search", difficulty: "Easy" },
//   { id: 3, title: "Longest Substring", difficulty: "Medium" },
//   { id: 4, title: "Merge Intervals", difficulty: "Medium" },
//   { id: 5, title: "Word Ladder", difficulty: "Hard" },
// ];
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function Problems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fav, setFav] = useState([]);
  const { token } = useAuth();
  const [showLoginMsg, setShowLoginMsg] = useState(false);
  const navigate = useNavigate();
  const addToFav = async (pid) => {
    if (!token) {
      setShowLoginMsg(true);
      setTimeout(() => {
        navigate("/auth/signin");
        setShowLoginMsg(false);
      }, 3000);
      return;
    }
    const res = await fetch(`http://localhost:5000/api/problems/fav/${pid}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await res.json();

    if (data.message === "Added") {
      setFav([...fav, pid]);
    } else {
      setFav(fav.filter((id) => id !== pid));
    }

  }
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/problems");

        const data = await res.json();
        if (!res.ok) {
          throw new Error("Failed to fetch problems");
        }
        setProblems(data);
      } catch (err) {
        setError(err.message);
      }
      finally {
        setLoading(false);
      }
    }

    const fetchFav = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/problems/fav",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );

        const data = await res.json();
        if (!res.ok) {
          throw new Error("Failed to fetch problems");
        }
        setFav(data || []);
      } catch (err) {
        setError(err.message);
      }
      finally {
        setLoading(false);
      }
    }
    fetchProblems();
    if (token) {
      fetchFav();
    }
  }, []);
  if (loading) return <h3>Loading Problems</h3>;
  if (error) return <h3>Error: {error}</h3>;
  return (
    <>
      <div style={{ padding: "20px" }}>
        <h2>Problems</h2>

        <ul>
          {problems.map((p) => (
            <li key={p._id}>
              <Link to={`/problems/${p.slug}`}>
                {p.title}
              </Link>
              {" "}— <b>{p.difficulty}</b>
              {/* if(fav.find(p._id)) */}
              <button onClick={() => addToFav(p._id)}>{fav.includes(p._id) ? "Remove from favourites" : "Add to Favourites"}</button>
            </li>
          ))}
        </ul>
      </div>
      {showLoginMsg && (
        <div className="login-popup">
          Please login first
        </div>
      )}
    </>
  );

}
export default Problems;
