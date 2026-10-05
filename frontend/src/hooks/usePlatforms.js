import React, { useEffect, useState } from 'react'
import api from '../services/api';

const usePlatforms = () => {
    const [platforms, setPlatforms] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const getPlatforms = async () => {
            try {
                const res = await api.get("/platforms");
                setPlatforms(res.data.results);
            }
            catch (error) {
                setError(error.message || "Failed to fetch games")
                console.log(error)
            }
        }
        getPlatforms();
    }, [])

    return [platforms, { error }]
}

export default usePlatforms;