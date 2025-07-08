#!/bin/bash

echo "🛑 Stopping DrumForFun Docker containers..."

docker-compose -f docker-compose.dev.yml down

echo "✅ Containers stopped"