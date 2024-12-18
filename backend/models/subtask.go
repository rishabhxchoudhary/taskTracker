package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Subtask struct {
	ID        primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	TaskID    primitive.ObjectID `json:"task_id" bson:"task_id"` // Reference to Task ID
	Title     string             `json:"title" bson:"title"`
	Status    string             `json:"status" bson:"status"` // e.g., "pending", "completed"
	CreatedAt primitive.DateTime `json:"created_at,omitempty" bson:"created_at,omitempty"`
	UpdatedAt primitive.DateTime `json:"updated_at,omitempty" bson:"updated_at,omitempty"`
}