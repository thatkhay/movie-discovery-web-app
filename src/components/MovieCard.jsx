import React, { useState, useEffect } from 'react';
import { Card, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from 'axios';
import Imbd from '../assets/imdblogo.png';
import Rotten from '../assets/rotten.png';
import { useMediaQuery } from '@mui/material';

function MovieCard({ movie }) {
  const isSmallScreen = useMediaQuery('(max-width: 600px)')
  const isTabscreen = useMediaQuery('(max-width: 1100px)')
  const isPcscreen = useMediaQuery('(min-width: 1110px)')
  const [isFavorite, setIsFavorite] = useState(false);
  const [genre, setGenre] = useState('');
  const [imdbPercentage, setImdbPercentage] = useState('');
  const [rottenPercentage, setRottenPercentage] = useState('');
  const [formattedReleaseYear, setFormattedReleaseYear] = useState('');

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setIsFavorite(favorites.includes(movie.id));

    // Fetch genre data for the movie
    const apiKey = '7a529b24ef789e4a50de476f2a2bbd35'; // Replace with your API key
    axios
      .get(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}`)
      .then((response) => {
        // Extract the genre names from the response and join them into a string
        const genreNames = response.data.genres.map((genre) => genre.name).join(', ');
        setGenre(genreNames);

        // Format the release year
        const formattedDate = formatToUTCDate(response.data.release_date);
        setFormattedReleaseYear(formattedDate);
      })
      .catch((error) => {
        console.error('Error fetching genre data:', error);
      });

    // Generate random percentages
    setImdbPercentage(getRandomPercentage());
    setRottenPercentage(getRandomPercentage());
  }, [movie.id]);

  function getRandomPercentage() {
    const randomPercentage = Math.floor(Math.random() * 51) + 50; // Generates a random number between 50 and 100
    return `${randomPercentage}%`;
  }

  const formatToUTCDate = (dateString) => {
    const localDate = new Date(dateString);
    const year = localDate.getUTCFullYear();
    const month = (localDate.getUTCMonth() + 1).toString().padStart(2, '0'); // Month is zero-indexed
    const day = localDate.getUTCDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (isFavorite) {
      const updatedFavorites = favorites.filter((id) => id !== movie.id);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } else {
      favorites.push(movie.id);
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    setIsFavorite(!isFavorite);
  };

  return (
    <Link
      to={`/movies/${movie.id}`}
      style={{ textDecoration: 'none' }}
      onClick={(e) => {
        if (e.target.closest('.favorite-icon')) {
          e.preventDefault();
          toggleFavorite();
        }
      }}
    >
      <Card className="movie-card" data-testid="movie-card" style={{ position: 'relative', width: isSmallScreen ? '100%' : 'auto' , marginLeft: isSmallScreen ? '10%' : 'auto'}}>
        <IconButton
          size='small'
          className="favorite-icon"
          style={{
            position: 'absolute',
            top: '5px',
            right: '5px',
            backgroundColor: 'white',
            cursor: 'pointer',
          }}
          onClick={toggleFavorite}
        >
          {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
        </IconButton>
        <img
          src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
          alt={movie.title}
          data-testid="movie-poster"
          style={{ height: '15rem', width: '100%' }}
        />
        <p
  data-testid="movie-release-date"
  style={{
    color: 'gray',
    fontSize: '.6rem',
    textAlign: 'left',
    marginLeft: '5px',
  }}
>
  <p style={{ fontWeight: 'bold' }}>{formatToUTCDate(formattedReleaseYear)}</p>
</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 .5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width:isSmallScreen? '30%' : '39%' }}>
            <img src={Imbd} alt="" style={{ height: '.8rem', width: '1.7rem' }} />
            <span style={{ fontSize: '.6rem' }}>{imdbPercentage} / 100</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width:isSmallScreen? '25%': '29%' }}>
            <img src={Rotten} alt="" style={{ height: '.8rem' }} />
            <span style={{ fontSize: '.6rem' }}>{rottenPercentage} / 100</span>
          </div>
        </div>
        <h2
          data-testid="movie-title"
          style={{ fontSize: '.8rem', textAlign: 'left', marginLeft: '5px' }}
        >
          {movie.title}
        </h2>
        <p
          data-testid="movie-genre"
          style={{
            color: 'gray',
            fontSize: '.6rem',
            textAlign: 'left',
            marginLeft: '5px',
          }}
        >
          <p style={{fontWeight: 'bold'}}>{genre}</p> 
        </p>
      </Card>
    </Link>
  );
}

export default MovieCard;
