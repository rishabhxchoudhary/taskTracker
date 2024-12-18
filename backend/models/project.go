package models

import "go.mongodb.org/mongo-driver/bson/primitive"

// Project represents a project created by a user.
type Project struct {
	ID          primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Name        string             `json:"name" bson:"name"`
	Description string             `json:"description,omitempty" bson:"description,omitempty"`
	OwnerID     primitive.ObjectID `json:"owner_id" bson:"owner_id"` // Reference to User ID
	CreatedAt   primitive.DateTime `json:"created_at,omitempty" bson:"created_at,omitempty"`
	UpdatedAt   primitive.DateTime `json:"updated_at,omitempty" bson:"updated_at,omitempty"`
	// Add more fields as needed, such as Status, Tags, etc.
}
