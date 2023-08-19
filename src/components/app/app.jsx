import { useEffect, useState } from 'react';
import { tempMovieData, tempWatchedData } from '../../data';

const API_KEY = '36db6edc';

const DEFAULT_SELECTED = 'tt11236038';

const Error = {
  canNotFetch: 'Can not fetch the data. Try later...',
  canNotFind: 'Can not find any movie...',
};

const throwError = (message) => {
  throw new Error(message);
};

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const debounce = (handler, delay = 1000) => {
  let timeout;
  return (evt) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => handler(evt), delay);
  };
};

const fetchMovies = async (query) => {
  const response = await fetch(
    `http://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`
  );
  const data = await response.json();
  if (!response.ok) throwError(Error.canNotFetch);
  if (data.Response === 'False') throwError(data.Error || Error.canNotFind);
  return data.Search;
};

export const App = () => {
  const [query, setQuery] = useState('interstellar');
  const [movies, setMovies] = useState([]);
  const [selectedId, setSelectedId] = useState(DEFAULT_SELECTED);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  console.log(movies);

  useEffect(() => {
    setError('');
    if (query === '') {
      setMovies([]);
      return;
    }
    setIsLoading(true);
    fetchMovies(query)
      .then((movies) => {
        setMovies(movies);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setIsLoading(false));
  }, [query]);

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <SearchResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {error && <ErrorMessage message={error} />}
          {!isLoading && !error && <MovieList movies={movies} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails id={selectedId} />
          ) : (
            <>
              <WachedSummary watched={watched} />
              <WachedMoviesList watched={watched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
};

const Loader = () => {
  return <p className='loader'>Loading...</p>;
};

const ErrorMessage = ({ message }) => {
  return <p className='error'>{message} 🙀🥷👀</p>;
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

const Search = ({ query, setQuery }) => {
  const handleSearch = debounce((evt) => setQuery(evt.target.value));

  return (
    <input
      className='search'
      type='text'
      defaultValue={query}
      placeholder='Search movies...'
      onChange={handleSearch}
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

export const MovieDetails = ({ id }) => {
  return <div className='details'>{id}</div>;
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
