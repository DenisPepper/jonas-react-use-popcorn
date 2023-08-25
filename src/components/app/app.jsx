import { useEffect, useRef, useState } from 'react';
import { tempMovieData, tempWatchedData } from '../../data';
import { StarRating } from '../star-rating/star-rating';
import { useKeypessHandler } from '../../use-keypess-handler';

const API_KEY = '36db6edc';

const WATCHED_KEY = 'watched';

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

const fetchMovies = async (query, abortController) => {
  const response = await fetch(
    `http://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`,
    { signal: abortController.signal }
  );
  const data = await response.json();
  if (!response.ok) throwError(Error.canNotFetch);
  if (data.Response === 'False') throwError(data.Error || Error.canNotFind);
  return data.Search;
};

const fetchMovieByID = async (id) => {
  const response = await fetch(
    `http://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`
  );
  const data = await response.json();
  return data;
};

export const App = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [watched, setWatched] = useState(() => {
    const saved = localStorage.getItem(WATCHED_KEY);
    return JSON.parse(saved);
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSetQuery = (value) => {
    setQuery(value);
  };

  const handleSelectMovie = (id) => {
    setSelectedId((prev) => (id === prev ? null : id));
  };

  const handleDiscardMovie = () => {
    setSelectedId(null);
  };

  const handleAddWached = (movie) => {
    setWatched((prev) => [...prev, movie]);
  };

  const handleRemoveWatched = (id) => {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  };

  useEffect(() => {
    localStorage.setItem(WATCHED_KEY, JSON.stringify(watched));
  }, [watched]);

  useEffect(() => {
    const abortController = new AbortController();
    handleDiscardMovie();
    setError('');
    if (query === '') {
      setMovies([]);
      return;
    }
    setIsLoading(true);
    fetchMovies(query, abortController)
      .then((movies) => {
        setMovies(movies);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      })
      .finally(() => setIsLoading(false));
    return () => abortController.abort(); // отменит предыдущий запрос, который отправляется через эффект
  }, [query]);

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={handleSetQuery} />
        <SearchResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {error && <ErrorMessage message={error} />}
          {!isLoading && !error && (
            <MovieList movies={movies} selectHandler={handleSelectMovie} />
          )}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              id={selectedId}
              discardHandler={handleDiscardMovie}
              addWatchedHandler={handleAddWached}
              watched={watched}
            />
          ) : (
            <>
              <WachedSummary watched={watched} />
              <WachedMoviesList
                watched={watched}
                removeHandler={handleRemoveWatched}
              />
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
  const input = useRef(null);

  const handleSearch = debounce((evt) => setQuery(evt.target.value));

  useKeypessHandler('Enter', (evt) => {
    if (evt.target === input.current) return;
    input.current?.focus();
    input.current.value = '';
    setQuery('');
  });

  useEffect(() => {
    input.current?.focus();
  }, []);

  return (
    <input
      className='search'
      type='text'
      defaultValue={query}
      placeholder='Search movies...'
      onChange={handleSearch}
      ref={input}
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

const MovieList = ({ movies, selectHandler }) => {
  return (
    <ul className='list list-movies'>
      {movies?.map((movie) => (
        <Movie key={movie.imdbID} movie={movie} selectHandler={selectHandler} />
      ))}
    </ul>
  );
};

export const Movie = ({ movie, selectHandler }) => {
  return (
    <li className='movie' onClick={() => selectHandler(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>📅</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
};

export const MovieDetails = ({
  id,
  discardHandler,
  addWatchedHandler,
  watched,
}) => {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState('');
  const isAdded = watched.find((movie) => movie.imdbID === id);

  const countRef = useRef(0);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  const handleAdd = () => {
    const newWatchedMovie = {
      imdbID: id,
      title,
      year,
      poster,
      userRating,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(' ').at(0)),
    };
    addWatchedHandler(newWatchedMovie);
    discardHandler();
  };

  useKeypessHandler('Escape', discardHandler);

  useEffect(() => {
    if (userRating) countRef.current++;
  }, [userRating]);

  useEffect(() => {
    setIsLoading(true);
    fetchMovieByID(id)
      .then((movie) => setMovie(movie))
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }, [id]);

  useEffect(() => {
    if (!title) return;
    document.title = title;
    return () => (document.title = 'use popcorn 🍿');
  }, [title]);

  return (
    <div className='details'>
      {isLoading && <Loader />}
      {!isLoading && (
        <>
          <header>
            <button className='btn-back' onClick={discardHandler} type='button'>
              ❌
            </button>
            <img src={poster} alt={`poster of ${title} movie`} />
            <div className='details-overview'>
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>🤩{imdbRating} IMDb rating</p>
            </div>
          </header>
          <section>
            <div className='rating'>
              {isAdded ? (
                <p>
                  Added to watched list with rating: {isAdded.userRating} ⭐
                </p>
              ) : (
                <StarRating
                  maxRating={10}
                  size={24}
                  setRatingHandler={setUserRating}
                />
              )}
              {userRating > 0 && (
                <button className='btn-add' onClick={handleAdd} type='button'>
                  + Add to list
                </button>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring: {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
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
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
};

const WachedMoviesList = ({ watched, removeHandler }) => {
  return (
    <ul className='list'>
      {watched.map((movie) => (
        <WachedMovie
          key={movie.imdbID}
          movie={movie}
          removeHandler={removeHandler}
        />
      ))}
    </ul>
  );
};

const WachedMovie = ({ movie, removeHandler }) => {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
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
        <button
          className='btn-delete'
          onClick={() => removeHandler(movie.imdbID)}
          type='button'
        >
          X
        </button>
      </div>
    </li>
  );
};
