import { useState, useEffect } from "react";
import API from "../API";
// Helpers
import { isPersistedState } from "../helpers";

export const useShowFetch = (showId) => {
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchShow = async () => {
      try {
        setLoading(true);
        setError(false);

        const movie = await API.fetchShow(showId);
        const credits = await API.fetchCredits(showId);
        // Get directors only
        const directors = credits.crew.filter(
          (member) => member.job === "Director"
        );

        setState({
          ...movie,
          actors: credits.cast,
          directors,
        });
        setLoading(false);
      } catch (error) {
        setError(true);
      }
    };

    const sessionState = isPersistedState(showId);

    if (sessionState) {
      setState(sessionState);
      setLoading(false);
      return;
    }

    fetchShow();
  }, [showId]);

  // Write to sessionStorage
  useEffect(() => {
    sessionStorage.setItem(showId, JSON.stringify(state));
  }, [showId, state]);
  return { state, loading, error };
};
