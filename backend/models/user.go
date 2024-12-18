package models

import "go.mongodb.org/mongo-driver/bson/primitive"

// User represents a user in the system.
type User struct {
	ID        primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Username  string             `json:"username" bson:"username"`
	Email     string             `json:"email" bson:"email"`
	Name      string             `json:"name" bson:"name"`
	Password  string             `json:"password,omitempty" bson:"password,omitempty"` // Passwords should be hashed
	CreatedAt primitive.DateTime `json:"created_at,omitempty" bson:"created_at,omitempty"`
	UpdatedAt primitive.DateTime `json:"updated_at,omitempty" bson:"updated_at,omitempty"`
	// Add more fields as needed, such as Role, ProfileInfo, etc.
}
