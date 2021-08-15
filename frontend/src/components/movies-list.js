import React, { useState, useEffect } from "react";
import MovieDataService from "../services/movie";
import { Link } from "react-router-dom";

const MoviesList = props => {
  const [movies, setMovies] = useState([]);
  const [searchTitle, setSearchTitle ] = useState("");
  const [searchRating, setSearchRating ] = useState("");
  const [searchYear, setSearchYear ] = useState("");
  const [years, setYears] = useState(["All Years"]);

  useEffect(() => {
    retrieveMovies();
    retrieveYears();
  }, []);

  const onChangeSearchTitle = e => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  const onChangeSearchRating = e => {
    const searchRating = e.target.value;
    setSearchRating(searchRating);
  };

  const onChangeSearchYear = e => {
    const searchYear = e.target.value;
    setSearchYear(searchYear);
    
  };

  const retrieveMovies = () => {
    MovieDataService.getAll()
      .then(response => {
        console.log(response.data);
        setMovies(response.data.movies);
        
      })
      .catch(e => {
        console.log(e);
      });
  };

  const retrieveYears = () => {
    MovieDataService.getYears()
      .then(response => {
        console.log(response.data);
        setYears(["All Years"].concat(response.data));
        
      })
      .catch(e => {
        console.log(e);
      });
  };

  const refreshList = () => {
    retrieveMovies();
  };

  const find = (query, by) => {
    MovieDataService.find(query, by)
      .then(response => {
        console.log(response.data);
        setMovies(response.data.movies);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const findByTitle = () => {
    find(searchTitle, "title")
  };

  const findByRating = () => {
    find(searchRating, "rating")
  };

  const findByYear = () => {
    if (searchYear == "All Year") {
      refreshList();
    } else {
      find(searchYear, "year")
    }
  };

  return (
    <div>
      <div className="row pb-1">
        <div className="input-group col-lg-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title"
            value={searchTitle}
            onChange={onChangeSearchTitle}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByTitle}
            >
              Search
            </button>
          </div>
        </div>
        <div className="input-group col-lg-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by rating"
            value={searchRating}
            onChange={onChangeSearchRating}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByRating}
            >
              Search
            </button>
          </div>
        </div>
        <div className="input-group col-lg-4">

          <select onChange={onChangeSearchYear}>
             {years.map(year => {
               return (
                 <option value={year.toString()}> {year.toString().substr(0, 4)} </option>
               )
             })}
          </select>
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByYear}
            >
              Search
            </button>
          </div>

        </div>
      </div>
      <div className="row">
        {movies.map((movie) => {
          const imdb = `${movie.imdb.rating} ${movie.imdb.votes}, ${movie.imdb.id}`;
          return (
            <div className="col-lg-4 pb-1">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{movie.title}</h5>
                  <p className="card-text">
                    <strong>Year: </strong>{movie.year}<br/>
                    <strong>IMDB: </strong>{imdb}
                  </p>
                  <div className="row">
                  <Link to={"/movies/"+movie._id} className="btn btn-primary col-lg-5 mx-1 mb-1">
                    View Reviews
                  </Link>
                  
                  </div>
                </div>
              </div>
            </div>
          );
        })}


      </div>
    </div>
  );
};

export default MoviesList;