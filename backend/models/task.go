package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Priority string

const (
	PriorityLow    Priority = "low"
	PriorityMedium Priority = "medium"
	PriorityHigh   Priority = "high"
	PriorityUrgent Priority = "urgent"
)

type TaskStatus string

const (
	StatusTodo       TaskStatus = "to_do"
	StatusInProgress TaskStatus = "in_progress"
	StatusDone       TaskStatus = "done"
)

type Task struct {
	ID           primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	ProjectID    primitive.ObjectID `json:"project_id" bson:"project_id"` // Reference to Project ID
	OwnerID      primitive.ObjectID `json:"owner_id" bson:"owner_id"`
	Title        string             `json:"title" bson:"title"`
	Description  string             `json:"description,omitempty" bson:"description,omitempty"`
	Priority     Priority           `json:"priority" bson:"priority"`
	DeadlineDate int64              `json:"deadline_date,omitempty" bson:"deadline_date,omitempty"`
	CreatedAt    int64              `json:"created_at,omitempty" bson:"created_at,omitempty"`
	BoardData    []byte             `json:"board_data,omitempty" bson:"board_data,omitempty"`
	Status       TaskStatus         `json:"status,omitempty" bson:"status,omitempty"`
	Position     float64            `json:"position,omitempty" bson:"position,omitempty"`
}
