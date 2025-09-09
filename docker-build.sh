#!/bin/bash

echo "🐳 Building Document Digitizer Docker Image"
echo "========================================"

# Build the Docker image
echo "Building Docker image..."
docker build -t document-digitizer:latest .

if [ $? -eq 0 ]; then
    echo "✅ Docker image built successfully!"
    echo ""
    echo "To run the container:"
    echo "  docker run -p 8000:8000 document-digitizer:latest"
    echo ""
    echo "The application will be available at:"
    echo "  http://localhost:8000"
else
    echo "❌ Docker build failed!"
    exit 1
fi
