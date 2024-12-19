package models

type GoogleLoginRequest struct {
	Name   string `json:"name" bson:"name"`
	Email  string `json:"email" bson:"email"`
	Avatar string `json:"avatar" bson:"avatar"`
}
