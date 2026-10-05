import React, { useEffect, useState } from 'react'
import api from '../services/api';

const useGenres = () => {
    const [genres, setGenres] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {

        const getGenre = async () => {
            try {
                const res = await api.get("/genres");
                setGenres(res.data.results);

            }
            catch (error) {
                setError(error.message || 'Failed to fetch genres');
                console.log(error);
            }

        }
        getGenre();
    }, [])

    return [genres, { error }]
};

export default useGenres;