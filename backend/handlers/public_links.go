package handlers

import (
	"backend/database"
	"backend/models"
	"encoding/json"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type GenerateLinkBody struct {
	TaskID    primitive.ObjectID `json:"taskId"`
	ProjectID primitive.ObjectID `json:"projectId"`
	Access    models.Access      `json:"access"`
	ExpiresAt int64              `json:"expiresAt"`
}

func GenerateLink(w http.ResponseWriter, r *http.Request) {
	user, err := GetUserFromJWT(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}
	var body GenerateLinkBody
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	publicLink := models.PublicLink{
		TaskID:    body.TaskID,
		ProjectID: body.ProjectID,
		OwnerID:   user.ID,
		Access:    body.Access,
		ExpiresAt: body.ExpiresAt,
		CreatedAt: time.Now().Unix(),
	}

	publicLink, err = database.GeneratePublicLink(publicLink)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(publicLink)
}
