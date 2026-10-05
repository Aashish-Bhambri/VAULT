import { useEffect, useState } from "react";
import api from "../services/api";

const useGameDetails = (slugOrId) => {
    const [details, setDetails] = useState(null);
    const [screenshots, setScreenshots] = useState([]);
    const [series, setSeries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!slugOrId) return;

        const controller = new AbortController();

        const fetchAll = async () => {
            setIsLoading(true);
            setError('');
            try {
                // Fetch main details
                const detailRes = await api.get(`/games/${slugOrId}`, {
                    signal: controller.signal,
                });
                setDetails(detailRes.data);

                // Fetch full screenshots
                api.get(`/games/${slugOrId}/screenshots`, {
                    signal: controller.signal,
                })
                    .then((res) => setScreenshots(res.data.results || []))
                    .catch(() => {});

                // Fetch franchise/series games
                api.get(`/games/${slugOrId}/game-series`, {
                    signal: controller.signal,
                })
                    .then((res) => setSeries(res.data.results || []))
                    .catch(() => {});
            } catch (err) {
                if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
                    setError(err.message || 'Failed to fetch game details');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchAll();

        return () => controller.abort();
    }, [slugOrId]);

    return { details, screenshots, series, isLoading, error };
};

export default useGameDetails;