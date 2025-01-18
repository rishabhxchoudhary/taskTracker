package database

import (
	"backend/models"
	"context"
	"fmt"
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

func CreateTask(task models.Task) (models.Task, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, err := GetTaskCollection().InsertOne(ctx, task)
	if err != nil {
		return task, err
	}
	task.ID = result.InsertedID.(primitive.ObjectID)
	return task, nil
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

func DeleteTask(taskID primitive.ObjectID, projectID primitive.ObjectID) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_, err := GetTaskCollection().DeleteOne(ctx, bson.M{"_id": taskID, "project_id": projectID})
	return err
}

func UpdateStatus(taskID primitive.ObjectID, projectID primitive.ObjectID, status models.TaskStatus, position float64) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	update := bson.M{
		"$set": bson.M{
			"status":   status,
			"position": position,
		},
	}

	var updatedTask models.Task
	err := GetTaskCollection().FindOneAndUpdate(ctx, bson.M{"_id": taskID, "project_id": projectID}, update).Decode(&updatedTask)
	if err != nil {
		if err.Error() == "mongo: no documents in result" {
			return fmt.Errorf("task not found")
		}
		return err
	}
	return err
}

func UpdateBulk(tasks []models.Task) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_, err := GetTaskCollection().UpdateMany(ctx, bson.M{"_id": bson.M{"$in": tasks}}, bson.M{"$set": bson.M{"status": tasks[0].Status, "position": tasks[0].Position}})
	return err
}
