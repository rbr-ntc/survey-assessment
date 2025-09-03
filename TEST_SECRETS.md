в# Test Secrets

This file tests if GitHub Actions secrets are working properly.

## Expected Values:

- FRONTEND_API_URL: https://evaly.ru/api
- MONGO_URL: mongodb://survey-assessment-mongo:27017/assessment
- API_KEY: wkQ3TikmbIinZW5mixoQsboRBSTpvJyi_eobGTF78WA
- CORS_ORIGINS: https://evaly.ru
- ENABLE_QUICK_TEST: true
- OPENAI_API_KEY: [ваш OpenAI API ключ]
- DOCKERHUB_USERNAME: [ваш Docker Hub username]
- SSL_CERTIFICATE: [ваш SSL сертификат GlobalSign]
- SSL_PRIVATE_KEY: [ваш приватный ключ]

## Next Steps:

1. Push this file to trigger deployment
2. Check if secrets are passed correctly to Docker build
3. Verify frontend gets correct API URL

---

_Generated on: $(date)_
