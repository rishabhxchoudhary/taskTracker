package handlers

import (
	"backend/database"
	"backend/models"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type GetAllTasksBody struct {
	ProjectID primitive.ObjectID `json:"projectId"`
}

func GetAllTasks(w http.ResponseWriter, r *http.Request) {
	user, err := GetUserFromJWT(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}
	var body GetAllTasksBody
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	projectID := body.ProjectID
	tasks, err := database.GetAllTasks(projectID, user.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tasks)
}

type CreateTaskBody struct {
	ProjectID   primitive.ObjectID `json:"projectId"`
	Title       string             `json:"title"`
	Description string             `json:"description"`
	Deadline    int64              `json:"deadlineDate"`
	Priority    models.Priority    `json:"priority"`
}

func CreateTask(w http.ResponseWriter, r *http.Request) {
	user, err := GetUserFromJWT(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}
	var body CreateTaskBody
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	fmt.Println("body", body)
	task := models.Task{
		ProjectID:    body.ProjectID,
		OwnerID:      user.ID,
		Title:        body.Title,
		Description:  body.Description,
		DeadlineDate: body.Deadline,
		Priority:     body.Priority,
		CreatedAt:    time.Now().Unix(),
	}
	fmt.Println("task", task)
	if err := database.CreateTask(task); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(task)

}
