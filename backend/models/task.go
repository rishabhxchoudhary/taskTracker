package models

import "go.mongodb.org/mongo-driver/bson/primitive"

// Task represents a task within a project.
type Task struct {
	ID          primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	ProjectID   primitive.ObjectID `json:"project_id" bson:"project_id"` // Reference to Project ID
	Title       string             `json:"title" bson:"title"`
	Description string             `json:"description,omitempty" bson:"description,omitempty"`
	Status      string             `json:"status" bson:"status"`                               // e.g., "pending", "in-progress", "completed"
	AssigneeID  primitive.ObjectID `json:"assignee_id,omitempty" bson:"assignee_id,omitempty"` // Reference to User ID
	DueDate     primitive.DateTime `json:"due_date,omitempty" bson:"due_date,omitempty"`
	CreatedAt   primitive.DateTime `json:"created_at,omitempty" bson:"created_at,omitempty"`
	UpdatedAt   primitive.DateTime `json:"updated_at,omitempty" bson:"updated_at,omitempty"`
	// Add more fields as needed, such as Priority, Labels, etc.
}
