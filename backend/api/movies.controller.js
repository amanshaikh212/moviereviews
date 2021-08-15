import { query } from "express"
import MoviesDAO from "../dao/moviesDAO.js"

export default class MoviesController{
    static async apiGetMovies(req,res,next){
        const moviesPerPage = req.query.moviesPerPage ? parseInt(req.query.moviesPerPage,10):20

        const page = req.query.page ? parseInt(req.query.page,10):0

        let filters={}
        if(req.query.year){
            filters.year= req.query.year
        }
        else if(req.query.rating){
            filters.rating = req.query.rating
        }
        else if(req.query.title){
            filters.title= req.query.title
        }
        //alert(query);

        const {moviesList,totalNumMovies }=await MoviesDAO.getMovies({
            filters,
            page,
            moviesPerPage,
        })

        let response={
            movies: moviesList,
            page: page,
            filters: filters,
            entries_per_page: moviesPerPage,
            total_results: totalNumMovies,
        }
        res.json(response)
    }


    static async apiGetMovieById(req, res, next) {
        try {
          let id = req.params.id || {}
          let movie = await MoviesDAO.getMovieByID(id)
          if (!movie) {
            res.status(404).json({ error: "Not found" })
            return
          }
          res.json(movie)
        } catch (e) {
          console.log(`api, ${e}`)
          res.status(500).json({ error: e })
        }
      }
    
      static async apiGetMovieYears(req, res, next) {
        try {
          let years = await MoviesDAO.getYears()
          res.json(years)
        } catch (e) {
          console.log(`api, ${e}`)
          res.status(500).json({ error: e })
        }
      }
}