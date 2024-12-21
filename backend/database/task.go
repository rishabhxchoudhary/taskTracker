package database

import (
	"backend/models"
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetAllTasks(project_id primitive.ObjectID, user_id primitive.ObjectID) ([]models.Task, error) {
	var tasks []models.Task
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	cursor, err := GetTaskCollection().Find(ctx, bson.M{"project_id": project_id, "owner_id": user_id})
	if err != nil {
		return tasks, err
	}
	err = cursor.All(ctx, &tasks)
	if err != nil {
		return tasks, err
	}
	return tasks, nil
}

func GetTaskByID(id string) (models.Task, error) {
	var task models.Task
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return task, err
	}
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	err = GetTaskCollection().FindOne(ctx, bson.M{"_id": objID}).Decode(&task)
	if err != nil {
		return task, err
	}
	return task, nil
}

func CreateTask(task models.Task) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_, err := GetTaskCollection().InsertOne(ctx, task)
	return err
}

func UpdateTask(id string, task models.Task) error {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_, err = GetTaskCollection().UpdateOne(ctx, bson.M{"_id": objID}, bson.M{"$set": task})
	return err
}

func DeleteTask(id string) error {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_, err = GetTaskCollection().DeleteOne(ctx, bson.M{"_id": objID})
	return err
}