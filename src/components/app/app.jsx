import { useEffect, useState } from 'react';
import { tempMovieData, tempWatchedData } from '../../data';

const API_KEY = '36db6edc';

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const fetchMovies = async (query) => {
  const response = await fetch(
    `http://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`
  );
  const data = await response.json();
  return data.Search;
};

export const App = () => {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const query = 'interstellar';

  useEffect(() => {
    setIsLoading(true);
    fetchMovies(query).then((movies) => {
      setMovies(movies);
      setIsLoading(false);
    });
  }, []);

  return (
    <>
      <NavBar>
        <Logo />
        <Search />
        <SearchResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading ? <span>Loading...</span> : <MovieList movies={movies} />}
        </Box>
        <Box>
          <WachedSummary watched={watched} />
          <WachedMoviesList watched={watched} />
        </Box>
      </Main>
    </>
  );
};

const NavBar = ({ children }) => {
  return <nav className='nav-bar'>{children}</nav>;
};

const Logo = () => {
  return (
    <div className='logo'>
      <span role='img'>🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
};

const Search = () => {
  const [query, setQuery] = useState('');

  return (
    <input
      className='search'
      type='text'
      placeholder='Search movies...'
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
};

const SearchResults = ({ movies }) => {
  return (
    <p className='num-results'>
      Found <strong>{movies.length}</strong> results
    </p>
  );
};

const Main = ({ children }) => {
  return <main className='main'>{children}</main>;
};

export const Box = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className='box scroller'>
      <button className='btn-toggle' onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? '–' : '+'}
      </button>
      {isOpen && children}
    </div>
  );
};

const MovieList = ({ movies }) => {
  return (
    <ul className='list'>
      {movies?.map((movie) => (
        <Movie key={movie.imdbID} movie={movie} />
      ))}
    </ul>
  );
};

export const Movie = ({ movie }) => {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
};

const WachedSummary = ({ watched }) => {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className='summary'>
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
};

const WachedMoviesList = ({ watched }) => {
  return (
    <ul className='list'>
      {watched.map((movie) => (
        <WachedMovie key={movie.imdbID} movie={movie} />
      ))}
    </ul>
  );
};

const WachedMovie = ({ movie }) => {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  );
};
