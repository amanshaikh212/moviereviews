import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId


let movies

export default class MoviesDAO{
    static async injectDB(conn) {
        if (movies) {
          return
        }
        try {
          movies = await conn.db(process.env.MOVREVIEWS_NS).collection("movies")
        } catch (e) {
          console.error(
            `Unable to establish a collection handle in moviesDAO: ${e}`,
          )
        }
      }
    
      static async getMovies({
        filters = null,
        page = 0,
        moviesPerPage = 20,
      } = {}) {
        let query
        if (filters) {
          if ("title" in filters) {
            query = { $text: { $search: filters["title"] } }
          } else if ("year" in filters) {
            query = { "year": { $eq: filters["year"] } }
          } else if ("rating" in filters) {
            query = { "imdb.rating": { $eq: filters["rating"] } }
          }
        }
    
        let cursor
        
        try {
          cursor = await movies
            .find(query)
        } catch (e) {
          console.error(`Unable to issue find command, ${e}`)
          return { moviesList: [], totalNumMovies: 0 }
        }
    
        const displayCursor = cursor.limit(moviesPerPage).skip(moviesPerPage * page)
    
        try {
          const moviesList = await displayCursor.toArray()
          const totalNumMovies = await movies.countDocuments(query)
    
          return { moviesList, totalNumMovies }
        } catch (e) {
          console.error(
            `Unable to convert cursor to array or problem counting documents, ${e}`,
          )
          return { moviesList: [], totalNumMovies: 0 }
        }
      }


      static async getMovieByID(id) {
        try {
          const pipeline = [
            {
                $match: {
                    _id: new ObjectId(id),
                },
            },
                  {
                      $lookup: {
                          from: "reviews",
                          let: {
                              id: "$_id",
                          },
                          pipeline: [
                              {
                                  $match: {
                                      $expr: {
                                          $eq: ["$movie_id", "$$id"],
                                      },
                                  },
                              },
                              {
                                  $sort: {
                                      date: -1,
                                  },
                              },
                          ],
                          as: "reviews",
                      },
                  },
                  {
                      $addFields: {
                          reviews: "$reviews",
                      },
                  },
              ]
          return await movies.aggregate(pipeline).next()
        } catch (e) {
          console.error(`Something went wrong in getMovieByID: ${e}`)
          throw e
        }
      }
    
      static async getYears() {
        let years = []
        try {
          years = await movies.distinct("year")
          return years
        } catch (e) {
          console.error(`Unable to get years, ${e}`)
          return years
        }
      }


}