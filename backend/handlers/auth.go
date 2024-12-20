package handlers

import (
	"backend/database"
	"backend/models"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var jwtSecret = []byte(os.Getenv("JWT_SECRET"))

func GenerateJWT(user models.User) (string, error) {
	claims := jwt.MapClaims{
		"user_id":    user.ID,
		"email":      user.Email,
		"name":       user.Name,
		"created_at": user.CreatedAt,
		"exp":        time.Now().Add(time.Hour * 72).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

func GoogleLogin(w http.ResponseWriter, r *http.Request) {
	var body models.GoogleLoginRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	user, err := database.GetUserByEmail(body.Email)
	if err != nil {
		newUser := models.User{
			Name:      body.Name,
			Email:     body.Email,
			CreatedAt: time.Now().Unix(),
		}

		if err := database.CreateUser(newUser); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		user = newUser
	}
	token, err := GenerateJWT(user)
	if err != nil {
		http.Error(w, "Failed to generate token", http.StatusInternalServerError)
		return
	}
	http.SetCookie(w, &http.Cookie{
		Name:     "auth_token",
		Value:    token,
		Expires:  time.Now().Add(72 * time.Hour), // Match the token expiration
		HttpOnly: true,                           // Prevents JavaScript access
		Secure:   false,                          // Ensure it's only sent over HTTPS
		SameSite: http.SameSite(0),               // Adjust based on your requirements
		Path:     "/",                            // Cookie is valid for the entire site
	})

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user)
}

func CurrentUser(w http.ResponseWriter, r *http.Request) {
	user, err := GetUserFromJWT(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}
	json.NewEncoder(w).Encode(user)
}

func GetUserFromJWT(r *http.Request) (models.User, error) {
	var user models.User
	cookie, err := r.Cookie("auth_token")
	if err != nil {
		return user, fmt.Errorf("unauthorized: missing auth_token cookie")
	}
	token, err := jwt.Parse(cookie.Value, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return jwtSecret, nil
	})
	if err != nil {
		return user, fmt.Errorf("unauthorized: invalid token")
	}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		userIDStr, ok := claims["user_id"].(string)
		if !ok {
			return user, fmt.Errorf("unauthorized: invalid user_id type")
		}
		userID, err := primitive.ObjectIDFromHex(userIDStr)
		if err != nil {
			return user, fmt.Errorf("unauthorized: invalid user_id format")
		}
		user.ID = userID
		user.CreatedAt = int64(claims["created_at"].(float64))
		user.Name = claims["name"].(string)
		user.Email = claims["email"].(string)
		return user, nil
	}
	return user, fmt.Errorf("unauthorized: invalid token claims")
}

func Logout(w http.ResponseWriter, r *http.Request) {
	http.SetCookie(w, &http.Cookie{
		Name:     "auth_token",
		Value:    "",
		Path:     "/",              // Ensure the path matches the one used during login
		Expires:  time.Unix(0, 0),  // Set expiration to the Unix epoch
		MaxAge:   -1,               // Instructs the browser to delete the cookie immediately
		HttpOnly: true,             // Prevents JavaScript access to the cookie
		Secure:   false,            // Set to true in production to ensure HTTPS transmission
		SameSite: http.SameSite(0), // Adjust based on your security requirements
	})

	w.WriteHeader(http.StatusOK)
	response := map[string]string{"message": "Logged out successfully"}
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, "Failed to send logout confirmation", http.StatusInternalServerError)
		return
	}
}
