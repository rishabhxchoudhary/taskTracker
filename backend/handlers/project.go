package handlers

import (
	"backend/database"
	"backend/models"
	"encoding/json"
	"net/http"
	"time"
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
