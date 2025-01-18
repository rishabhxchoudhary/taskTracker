package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Board struct {
	ID        primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	BoardData []byte             `json:"board_data,omitempty" bson:"board_data,omitempty"`
}
