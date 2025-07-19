#!/bin/bash

API_URL="http://localhost:3000/api/contacts"

echo "í¿¢ Test 1: Valid data with photo"
curl -s -o /dev/null -w "Status: %{http_code}\n" -X POST "$API_URL" \
  -H "Content-Type: multipart/form-data" \
  -F "name=Alice Smith" \
  -F "email=alice@example.com" \
  -F "phoneNumber=+380123456789" \
  -F "contactType=work" \
  -F "photo=@test-avatar.jpg" \
  -F "isFavourite=true"

echo -e "\ní¿¢ Test 2: Valid data without photo"
curl -s -o /dev/null -w "Status: %{http_code}\n" -X POST "$API_URL" \
  -H "Content-Type: multipart/form-data" \
  -F "name=Bob" \
  -F "email=bob@example.com" \
  -F "phoneNumber=+380987654321" \
  -F "contactType=friend" \
  -F "isFavourite=false"

echo -e "\ní´´ Test 3: Missing required 'name'"
curl -s -o /dev/null -w "Status: %{http_code}\n" -X POST "$API_URL" \
  -H "Content-Type: multipart/form-data" \
  -F "email=noname@example.com" \
  -F "phoneNumber=+380111111111" \
  -F "isFavourite=true"

echo -e "\ní´´ Test 4: Invalid email format"
curl -s -o /dev/null -w "Status: %{http_code}\n" -X POST "$API_URL" \
  -H "Content-Type: multipart/form-data" \
  -F "name=Invalid Email" \
  -F "email=not-an-email" \
  -F "phoneNumber=+380000000000" \
  -F "isFavourite=false"

echo -e "\ní´´ Test 5: Invalid isFavourite type"
curl -s -o /dev/null -w "Status: %{http_code}\n" -X POST "$API_URL" \
  -H "Content-Type: multipart/form-data" \
  -F "name=Wrong Type" \
  -F "email=wrong@example.com" \
  -F "phoneNumber=+380222222222" \
  -F "isFavourite=maybe"

