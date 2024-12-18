package router

import (
	"backend/handlers"
	"backend/middleware"

	"github.com/gorilla/mux"
)

func NewRouter() *mux.Router {
	r := mux.NewRouter()

	r.Use(middleware.LoggingMiddleware)

	api := r.PathPrefix("/api").Subrouter()

	userRouter := api.PathPrefix("/user").Subrouter()
	userRouter.HandleFunc("", handlers.GetAllUsers).Methods("GET")
	userRouter.HandleFunc("", handlers.CreateUser).Methods("POST")
	userRouter.HandleFunc("/{id}", handlers.GetUser).Methods("GET")
	userRouter.HandleFunc("/{id}", handlers.UpdateUser).Methods("PUT")
	userRouter.HandleFunc("/{id}", handlers.DeleteUser).Methods("DELETE")

	// Project routes
	// projectRouter := api.PathPrefix("/project").Subrouter()
	// projectRouter.HandleFunc("", handlers.GetAllProjects).Methods("GET")
	// projectRouter.HandleFunc("", handlers.CreateProject).Methods("POST")
	// projectRouter.HandleFunc("/{id}", handlers.GetProject).Methods("GET")
	// projectRouter.HandleFunc("/{id}", handlers.UpdateProject).Methods("PUT")
	// projectRouter.HandleFunc("/{id}", handlers.DeleteProject).Methods("DELETE")

	// // Task routes
	// taskRouter := api.PathPrefix("/task").Subrouter()
	// taskRouter.HandleFunc("", handlers.GetAllTasks).Methods("GET")
	// taskRouter.HandleFunc("", handlers.CreateTask).Methods("POST")
	// taskRouter.HandleFunc("/{id}", handlers.GetTask).Methods("GET")
	// taskRouter.HandleFunc("/{id}", handlers.UpdateTask).Methods("PUT")
	// taskRouter.HandleFunc("/{id}", handlers.DeleteTask).Methods("DELETE")

	// // Subtask routes
	// subtaskRouter := api.PathPrefix("/subtask").Subrouter()
	// subtaskRouter.HandleFunc("", handlers.GetAllSubtasks).Methods("GET")
	// subtaskRouter.HandleFunc("", handlers.CreateSubtask).Methods("POST")
	// subtaskRouter.HandleFunc("/{id}", handlers.GetSubtask).Methods("GET")
	// subtaskRouter.HandleFunc("/{id}", handlers.UpdateSubtask).Methods("PUT")
	// subtaskRouter.HandleFunc("/{id}", handlers.DeleteSubtask).Methods("DELETE")

	return r
}
