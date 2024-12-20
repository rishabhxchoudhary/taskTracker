package database

import (
	"backend/models"
	"bytes"
	"context"
	"io"
	"time"

	"github.com/andybalholm/brotli"
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

func GetBoardData(id primitive.ObjectID) (string, error) {
	var task models.Task
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err := GetTaskCollection().FindOne(ctx, bson.M{"_id": id}).Decode(&task)
	if err != nil {
		return "", err
	}

	// Decompress the boardData using Brotli
	reader := brotli.NewReader(bytes.NewReader(task.BoardData))
	var decompressedBuf bytes.Buffer
	_, err = io.Copy(&decompressedBuf, reader)
	if err != nil {
		return "", err
	}

	return decompressedBuf.String(), nil
}

func SetBoardData(id primitive.ObjectID, boardData string) error {
	var buf bytes.Buffer
	writer := brotli.NewWriter(&buf)
	_, err := writer.Write([]byte(boardData))
	if err != nil {
		writer.Close()
		return err
	}
	writer.Close() // It's important to close the writer to flush all data

	compressedData := buf.Bytes()

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	update := bson.M{
		"$set": bson.M{
			"board_data": compressedData,
		},
	}
	_, err = GetTaskCollection().UpdateOne(ctx, bson.M{"_id": id}, update)
	return err
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
