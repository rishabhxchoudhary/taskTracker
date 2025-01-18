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

func GetBoardData(id primitive.ObjectID) (string, error) {
	var board models.Board
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err := GetBoardCollection().FindOne(ctx, bson.M{"_id": id}).Decode(&board)
	if err != nil {
		return "", err
	}

	// Decompress the boardData using Brotli
	reader := brotli.NewReader(bytes.NewReader(board.BoardData))
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
	_, err = GetBoardCollection().UpdateOne(ctx, bson.M{"_id": id}, update)
	return err
}

func CreateEmptyBoard() (primitive.ObjectID, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	result, err := GetBoardCollection().InsertOne(ctx, models.Board{})
	if err != nil {
		return primitive.NilObjectID, err
	}
	return result.InsertedID.(primitive.ObjectID), nil
}