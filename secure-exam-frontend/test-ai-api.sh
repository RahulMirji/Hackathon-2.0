#!/bin/bash

# Load environment variables
if [ -f .env.local ]; then
  export $(cat .env.local | grep -v '^#' | xargs)
fi

echo "🧪 Testing AI API directly..."
echo ""

if [ -z "$AI_API_URL" ] || [ -z "$AI_API_KEY" ] || [ -z "$AI_MODEL" ]; then
  echo "❌ Error: Missing environment variables"
  echo "Please set AI_API_URL, AI_API_KEY, and AI_MODEL in .env.local"
  exit 1
fi

curl -v "$AI_API_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AI_API_KEY" \
  -d "{
    \"model\": \"$AI_MODEL\",
    \"messages\": [
      {
        \"role\": \"system\",
        \"content\": \"You are a JSON generator. Return ONLY valid JSON array, no markdown, no explanations.\"
      },
      {
        \"role\": \"user\",
        \"content\": \"Generate 1 coding question in this EXACT format: [{\\\"id\\\":1,\\\"title\\\":\\\"Two Sum\\\",\\\"description\\\":\\\"Given an array of integers\\\",\\\"constraints\\\":[\\\"2 <= nums.length\\\"],\\\"examples\\\":[{\\\"input\\\":\\\"nums=[2,7]\\\",\\\"output\\\":\\\"[0,1]\\\",\\\"explanation\\\":\\\"sum\\\"}],\\\"testCases\\\":[{\\\"input\\\":\\\"2,7\\\\n9\\\\n\\\",\\\"expectedOutput\\\":\\\"0 1\\\"}],\\\"difficulty\\\":\\\"easy\\\"}]\"
      }
    ],
    \"temperature\": 0.3,
    \"stream\": false
  }"

echo ""
echo ""
echo "✅ Test complete! Check the response above."
