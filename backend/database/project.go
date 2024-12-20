package database

import (
	"backend/models"
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetAllProjects(user_id primitive.ObjectID) ([]models.Project, error) {
	var projects []models.Project
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	cursor, err := GetProjectCollection().Find(ctx, bson.M{"owner_id": user_id})
	if err != nil {
		return projects, err
	}
	err = cursor.All(ctx, &projects)
	if err != nil {
		return projects, err
	}
	return projects, nil
}

func CreateProject(project models.Project) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_, err := GetProjectCollection().InsertOne(ctx, project)
	return err
}
