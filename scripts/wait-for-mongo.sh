#!/bin/bash
# wait-for-mongo.sh - Wait for MongoDB to be ready

set -e

host="$1"
port="$2"
shift 2
cmd="$@"

echo "Waiting for MongoDB at $host:$port..."

# Wait for MongoDB to accept connections
until nc -z "$host" "$port" 2>/dev/null; do
  echo "MongoDB is unavailable - sleeping"
  sleep 2
done

echo "MongoDB is up - executing command"
exec $cmd
