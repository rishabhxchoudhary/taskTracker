package router

import (
	"backend/handlers"
	"backend/middleware"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func NewRouter() *mux.Router {
	r := mux.NewRouter()
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization"},
		AllowCredentials: true,
	})
	r.Use(c.Handler)
	r.Use(middleware.LoggingMiddleware)

	r.Methods("OPTIONS").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	api := r.PathPrefix("/api").Subrouter()

	api.HandleFunc("/healthcheck", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("success"))
	}).Methods("GET")

	userRouter := api.PathPrefix("/user").Subrouter()
	userRouter.HandleFunc("/googleLogin", handlers.GoogleLogin).Methods("POST")
	userRouter.HandleFunc("/current_user", handlers.CurrentUser).Methods("GET")
	userRouter.HandleFunc("/logout", handlers.Logout).Methods("GET")

	projectRouter := api.PathPrefix("/project").Subrouter()
	projectRouter.HandleFunc("", handlers.GetAllProjects).Methods("GET")
	projectRouter.HandleFunc("", handlers.CreateProject).Methods("POST")
	projectRouter.HandleFunc("/delete", handlers.DeleteProject).Methods("POST")

	taskRouter := api.PathPrefix("/task").Subrouter()
	taskRouter.HandleFunc("", handlers.GetAllTasks).Methods("POST")
	taskRouter.HandleFunc("/create", handlers.CreateTask).Methods("POST")

	taskRouter.HandleFunc("/board/{id}", handlers.GetBoardData).Methods("GET")
	taskRouter.HandleFunc("/board/{id}", handlers.SetBoardData).Methods("POST")


	return r
}
