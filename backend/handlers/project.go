package handlers

import (
	"backend/database"
	"backend/models"
	"encoding/json"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetAllProjects(w http.ResponseWriter, r *http.Request) {
	user, err := GetUserFromJWT(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}
	projects, err := database.GetAllProjects(user.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if len(projects) == 0 {
		defaultProject := models.Project{
			Name:        "Sample Project",
			OwnerID:     user.ID,
			CreatedAt:   time.Now().Unix(),
			Description: "This is a sample project created for you.",
		}

		if err := database.CreateProject(defaultProject); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		projects, err = database.GetAllProjects(user.ID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
	json.NewEncoder(w).Encode(projects)
}

func CreateProject(w http.ResponseWriter, r *http.Request) {
	user, err := GetUserFromJWT(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}
	var project models.Project
	if err := json.NewDecoder(r.Body).Decode(&project); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	project.CreatedAt = time.Now().Unix()
	project.OwnerID = user.ID
	if err := database.CreateProject(project); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(project)
}

type ID struct {
	ID primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
}

func DeleteProject(w http.ResponseWriter, r *http.Request) {
	_, err := GetUserFromJWT(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}
	var id ID
	if err := json.NewDecoder(r.Body).Decode(&id); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if err := database.DeleteProject(id.ID); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
