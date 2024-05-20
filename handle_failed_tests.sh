#!/bin/bash

# Define the path to the file storing failed test names
FAILED_TESTS_FILE="test-results/last-run.txt"

# Check if the file exists
if [ -f "$FAILED_TESTS_FILE" ]; then
  # Read the file and store the names in an environment variable
  export FAILED_TESTS=$(cat "$FAILED_TESTS_FILE")
else
  echo "No failed tests found."
  export FAILED_TESTS=""
fi

# Print the failed tests for debugging purposes
echo "Failed tests: $FAILED_TESTS"