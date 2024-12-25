package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Access string

const (
	ViewAccess Access = "view"
	EditAccess Access = "edit"
)

type PublicLink struct {
	ID        primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	ProjectID primitive.ObjectID `json:"project_id" bson:"project_id"`
	TaskID    primitive.ObjectID `json:"task_id" bson:"task_id"`
	OwnerID   primitive.ObjectID `json:"owner_id" bson:"owner_id"`
	Access    Access             `json:"access" bson:"access"`
	CreatedAt int64              `json:"created_at,omitempty" bson:"created_at,omitempty"`
	ExpiresAt int64              `json:"expires_at,omitempty" bson:"expires_at,omitempty"`
}
