#!/bin/bash

echo "📋 Showing DrumForFun Docker logs..."

docker-compose -f docker-compose.dev.yml logs -f web