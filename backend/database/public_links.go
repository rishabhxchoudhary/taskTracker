package database

import (
	"backend/models"
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GeneratePublicLink(publicLink models.PublicLink) (models.PublicLink, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	result, err := GetPublicLinkCollection().InsertOne(ctx, publicLink)
	if err != nil {
		return publicLink, err
	}
	publicLink.ID = result.InsertedID.(primitive.ObjectID)
	return publicLink, nil
}

func GetPublicLink(ID primitive.ObjectID) (models.PublicLink, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	var publicLink models.PublicLink
	err := GetPublicLinkCollection().FindOne(ctx, bson.M{"_id": ID}).Decode(&publicLink)
	if err != nil {
		return publicLink, err
	}
	return publicLink, nil
}