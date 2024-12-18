package database

import (
	"backend/models"
	"context"
	"errors"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetAllUsers() ([]models.User, error) {
	var users []models.User
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	cursor, err := GetUserCollection().Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var user models.User
		if err := cursor.Decode(&user); err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return users, nil
}

func CreateUser(user models.User) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := GetUserCollection().InsertOne(ctx, user)
	return err
}

func GetUserByID(id string) (models.User, error) {
	var user models.User
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return user, err
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err = GetUserCollection().FindOne(ctx, bson.M{"_id": objID}).Decode(&user)
	if err != nil {
		return user, err
	}

	return user, nil
}
func GetUserByUsername(id string) (models.User, error) {
	var user models.User
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err := GetUserCollection().FindOne(ctx, bson.M{"username": id}).Decode(&user)
	if err != nil {
		return user, err
	}
	return user, nil
}

func UpdateUser(id string, user models.User) error {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	update := bson.M{
		"$set": bson.M{
			"name":  user.Name,
			"email": user.Email,
			// Add other fields as necessary
		},
	}

	result, err := GetUserCollection().UpdateOne(ctx, bson.M{"_id": objID}, update)
	if err != nil {
		return err
	}

	if result.MatchedCount == 0 {
		return errors.New("no matching user found")
	}

	return nil
}

func DeleteUser(id string) error {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, err := GetUserCollection().DeleteOne(ctx, bson.M{"_id": objID})
	if err != nil {
		return err
	}

	if result.DeletedCount == 0 {
		return errors.New("no matching user found")
	}

	return nil
}
