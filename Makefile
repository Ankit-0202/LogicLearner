# Makefile for LogicLearner React Native Project

# Project Variables
APP_NAME = LogicLearner
IOS_SCHEME = LogicLearner
ANDROID_APP_ID = org.reactjs.native.example.LogicLearner

# Colors for output
GREEN = \033[0;32m
YELLOW = \033[0;33m
NC = \033[0m # No Color

# Default target
.DEFAULT_GOAL := help

# Install project dependencies
install:
	@echo "$(GREEN)Installing project dependencies...$(NC)"
	npm install

# Start Metro bundler
start:
	@echo "$(GREEN)Starting Metro bundler...$(NC)"
	npm start

# Run the app on iOS simulator or device
ios:
	@echo "$(GREEN)Running app on iOS...$(NC)"
	npx react-native run-ios --scheme $(IOS_SCHEME)

# Run the app on Android emulator or device
android:
	@echo "$(GREEN)Running app on Android...$(NC)"
	npx react-native run-android

# Build the iOS app for Release
build-ios:
	@echo "$(GREEN)Building iOS app for Release...$(NC)"
	npx react-native run-ios --configuration Release --scheme $(IOS_SCHEME)

# Build the Android app for Release
build-android:
	@echo "$(GREEN)Building Android app for Release...$(NC)"
	npx react-native run-android --variant=release

# Clean project caches and build artifacts
clean:
	@echo "$(YELLOW)Cleaning project caches and build artifacts...$(NC)"
	rm -rf node_modules
	rm -rf ios/Pods
	rm -rf ios/build
	rm -rf android/app/build
	npm cache clean --force
	@echo "$(GREEN)Clean complete.$(NC)"

# Lint the project using ESLint
lint:
	@echo "$(GREEN)Linting project...$(NC)"
	npx eslint .

# Run Jest tests
test:
	@echo "$(GREEN)Running Jest tests...$(NC)"
	npm test

# Run Jest tests in watch mode
test-watch:
	@echo "$(GREEN)Running Jest tests in watch mode...$(NC)"
	npx jest --watch

# Format code using Prettier
format:
	@echo "$(GREEN)Formatting code with Prettier...$(NC)"
	npx prettier --write .

# Show available Makefile targets
help:
	@echo "Available Makefile targets:"
	@echo "  install        Install project dependencies"
	@echo "  start          Start Metro bundler"
	@echo "  ios            Run app on iOS simulator/device"
	@echo "  android        Run app on Android emulator/device"
	@echo "  build-ios      Build iOS app for Release"
	@echo "  build-android  Build Android app for Release"
	@echo "  clean          Clean project caches and build artifacts"
	@echo "  lint           Lint the project using ESLint"
	@echo "  test           Run Jest tests"
	@echo "  test-watch     Run Jest tests in watch mode"
	@echo "  format         Format code using Prettier"
	@echo "  help           Show this help message"

# Specify targets as phony to prevent conflicts with files of the same name
.PHONY: install start ios android build-ios build-android clean lint test test-watch format help
