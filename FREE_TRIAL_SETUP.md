# Temple Notification System - Free Trial Setup
# Complete setup guide using free services and trials

## 🆓 Free Trial Services Configuration

### 1. Twilio Free Trial Setup
- **Sign up**: https://www.twilio.com/try-twilio
- **Free Credit**: $15-20 (enough for ~1000 voice calls)
- **Free SMS**: 1000 messages/month
- **Free Phone Number**: 1 number included

### 2. WhatsApp Business API Free Tier
- **Sign up**: https://developers.facebook.com/docs/whatsapp/getting-started
- **Free Messages**: 1000 messages/month
- **Free Phone Number**: 1 number included

### 3. Free Hosting Options
- **Railway**: https://railway.app (free tier)
- **Render**: https://render.com (free tier)
- **Heroku**: https://heroku.com (free tier - limited)
- **Vercel**: https://vercel.com (frontend hosting)

### 4. Free Database
- **Supabase**: https://supabase.com (free tier)
- **Neon**: https://neon.tech (free tier)
- **PlanetScale**: https://planetscale.com (free tier)

## 🚀 Quick Setup Instructions

### Step 1: Twilio Setup
1. Sign up for Twilio free trial
2. Get your Account SID and Auth Token
3. Get a free phone number
4. Note: Free trial has limitations (verified numbers only)

### Step 2: WhatsApp Business API
1. Create Facebook Developer account
2. Set up WhatsApp Business API
3. Get access token and phone number ID
4. Note: Requires business verification for production

### Step 3: Database Setup (Supabase)
1. Create Supabase account
2. Create new project
3. Get connection string
4. Run database migrations

### Step 4: Deploy to Railway
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

## 💰 Cost Breakdown (Free Trial)

### Twilio Free Trial
- **Voice Calls**: $15 credit ≈ 1,765 minutes (1,000+ calls)
- **SMS**: 1,000 free messages/month
- **Total Cost**: $0 (within trial limits)

### WhatsApp Business API
- **Messages**: 1,000 free/month
- **Total Cost**: $0

### Hosting & Database
- **Railway**: Free tier (limited hours)
- **Supabase**: Free tier (500MB database)
- **Total Cost**: $0

### Total Estimated Cost: $0 (Free Trial Period)

## ⚠️ Free Trial Limitations

### Twilio Limitations:
- Only verified phone numbers work
- $15-20 credit limit
- Requires credit card verification
- Trial period: 30 days

### WhatsApp Limitations:
- 1,000 messages/month limit
- Requires business verification
- Limited to business hours

### Hosting Limitations:
- Railway: 500 hours/month
- Supabase: 500MB database
- Render: 750 hours/month

## 🔧 Updated Configuration

### application.yml (Free Trial Version)
```yaml
# Free Trial Configuration
spring:
  profiles:
    active: free-trial
  
  datasource:
    url: ${DATABASE_URL}
    driver-class-name: org.postgresql.Driver
  
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false

# Twilio Free Trial Configuration
twilio:
  account-sid: ${TWILIO_ACCOUNT_SID}
  auth-token: ${TWILIO_AUTH_TOKEN}
  phone-number: ${TWILIO_PHONE_NUMBER}
  webhook-url: ${WEBHOOK_URL}

# WhatsApp Business API Free Tier
whatsapp:
  access-token: ${WHATSAPP_ACCESS_TOKEN}
  phone-number-id: ${WHATSAPP_PHONE_NUMBER_ID}
  api-version: v18.0

# Free Trial Optimizations
notification:
  voice:
    max-concurrent-calls: 5  # Reduced for free tier
    retry-attempts: 2        # Reduced to save credits
  sms:
    retry-attempts: 1        # Reduced to save credits
  whatsapp:
    retry-attempts: 1        # Reduced to save credits

# Server Configuration
server:
  port: ${PORT:8080}
  servlet:
    context-path: /api

# Logging (minimal for free tier)
logging:
  level:
    com.temple.notification: INFO
    org.springframework.web: WARN
```

## 📋 Environment Variables (.env)

```bash
# Twilio Free Trial
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# WhatsApp Business API Free Tier
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token
WHATSAPP_PHONE_NUMBER_ID=your_whatsapp_phone_number_id

# Database (Supabase Free Tier)
DATABASE_URL=postgresql://user:password@host:port/database

# Webhook URL (ngrok for development)
WEBHOOK_URL=https://your-ngrok-url.ngrok.io/api/webhooks

# Hosting Platform
PORT=8080
```

## 🛠️ Development Setup with ngrok

### Local Development with Free Services
```bash
# 1. Start the application locally
mvn spring-boot:run

# 2. Start ngrok for webhook tunneling
ngrok http 8080

# 3. Update webhook URL in Twilio console
# Use the ngrok URL: https://abc123.ngrok.io/api/webhooks

# 4. Test with a few phone numbers
```

## 📊 Free Trial Usage Monitoring

### Twilio Usage Dashboard
- Monitor credit usage: https://console.twilio.com/
- Set up alerts for 80% credit usage
- Track call and SMS costs

### WhatsApp Business API Monitoring
- Monitor message usage in Facebook Developer Console
- Set up webhooks for delivery receipts

### Database Usage (Supabase)
- Monitor database size: https://supabase.com/dashboard
- Stay under 500MB limit

## 🔄 Fallback Strategy for Free Trial

### Primary Strategy (Cost-Effective)
1. **Voice Calls**: Limited to 5 concurrent (save credits)
2. **SMS Fallback**: Only for failed voice calls
3. **WhatsApp**: Only for critical notifications
4. **Retry Logic**: Reduced attempts to save credits

### Emergency Strategy
If credits run out:
1. Switch to SMS-only mode
2. Use WhatsApp Business API (free tier)
3. Implement email notifications (free)
4. Use local phone system if available

## 🚀 Deployment Options

### Option 1: Railway (Recommended)
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login to Railway
railway login

# 3. Initialize project
railway init

# 4. Deploy
railway up
```

### Option 2: Render
```bash
# 1. Connect GitHub repository
# 2. Set environment variables
# 3. Deploy automatically
```

### Option 3: Heroku
```bash
# 1. Install Heroku CLI
# 2. Create app
heroku create temple-notification-app

# 3. Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# 4. Deploy
git push heroku main
```

## 📱 Testing with Free Trial

### Test Phone Numbers
- Use your own phone number for testing
- Add family/friends for small-scale testing
- Use Twilio test numbers for development

### Test Scenarios
1. **Single Voice Call**: Test basic functionality
2. **SMS Fallback**: Test when voice call fails
3. **WhatsApp**: Test WhatsApp Business API
4. **Bulk Test**: Test with 10-20 numbers first

## 💡 Cost Optimization Tips

### Voice Calls
- Use shorter message duration
- Implement smart retry logic
- Use SMS for non-critical notifications

### SMS
- Keep messages concise
- Use Unicode characters sparingly
- Implement delivery tracking

### WhatsApp
- Use template messages (free)
- Implement delivery receipts
- Monitor message status

## 🔐 Security for Free Trial

### Environment Variables
- Never commit credentials to Git
- Use platform-specific secret management
- Rotate tokens regularly

### Webhook Security
- Implement webhook signature verification
- Use HTTPS for all webhooks
- Validate incoming requests

## 📈 Scaling from Free Trial

### When to Upgrade
- Exceed 1,000 messages/month
- Need more than 500MB database
- Require 24/7 uptime
- Need advanced features

### Upgrade Path
1. **Twilio**: Pay-as-you-go plan
2. **WhatsApp**: Business verification
3. **Hosting**: Paid tier (Railway/Render)
4. **Database**: Paid tier (Supabase)

## 🆘 Support Resources

### Free Trial Support
- **Twilio**: Community forums, documentation
- **WhatsApp**: Developer documentation
- **Railway**: Discord community
- **Supabase**: Community forums

### Documentation Links
- Twilio Voice API: https://www.twilio.com/docs/voice
- WhatsApp Business API: https://developers.facebook.com/docs/whatsapp
- Railway Docs: https://docs.railway.app
- Supabase Docs: https://supabase.com/docs

---

**🎯 Goal: Test the system with free trials before committing to paid services!**
