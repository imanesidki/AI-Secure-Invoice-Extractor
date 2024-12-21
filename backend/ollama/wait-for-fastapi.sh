#!/bin/bash

while ! curl -s http://fastapi:8000/ > /dev/null; do
  echo "Waiting for FastAPI to be healthy..."
  sleep 5
done

echo "FastAPI is up! Proceeding to start ollama."
exec "$@"
