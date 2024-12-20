package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Project struct {
	ID          primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Name        string             `json:"name" bson:"name"`
	Description string             `json:"description,omitempty" bson:"description,omitempty"`
	OwnerID     primitive.ObjectID `json:"owner_id" bson:"owner_id"` // Reference to User ID
	CreatedAt   int64              `json:"created_at,omitempty" bson:"created_at,omitempty"`
}
