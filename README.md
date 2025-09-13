# Temple Devotee Notification System

A comprehensive notification system designed specifically for temples to inform devotees (bakthas) about special functions like Amavasai pooja. The system can handle 1000+ devotees with automatic voice calls, SMS, and WhatsApp notifications.

## 🎯 Key Features

### Core Functionality
- **Voice Calls**: Automatically makes voice calls to devotees with pre-recorded message
- **SMS Fallback**: Sends SMS if voice calls fail
- **WhatsApp Integration**: WhatsApp Business API integration for modern communication
- **Scalable Architecture**: Handles 1000+ devotees efficiently
- **Cost Control**: Rate limiting and concurrent call management
- **Retry Logic**: Automatic retry with fallback methods

### Temple-Specific Features
- **Pre-recorded Message**: "Tomorrow there is a pooja, please join it."
- **Automatic Call Termination**: Calls end automatically after message delivery
- **Multi-channel Strategy**: Voice → SMS → WhatsApp fallback
- **Amavasai Campaign Support**: Special handling for lunar calendar events

## 🏗️ System Architecture

### Backend Components
```
src/main/java/com/temple/notification/
├── controller/
│   ├── DevoteeController.java          # Devotee management API
│   ├── NotificationCampaignController.java  # Campaign management API
│   └── TempleWebhookController.java     # Twilio webhook handling
├── service/
│   ├── DevoteeService.java             # Devotee business logic
│   ├── TempleNotificationService.java  # Core notification service
│   └── TempleCampaignExecutionService.java  # Campaign execution
├── model/
│   ├── Devotee.java                    # Devotee entity
│   ├── NotificationCampaign.java       # Campaign entity
│   └── NotificationLog.java           # Notification tracking
├── repository/
│   ├── DevoteeRepository.java          # Devotee data access
│   ├── NotificationCampaignRepository.java  # Campaign data access
│   └── NotificationLogRepository.java  # Notification logs
├── dto/
│   ├── DevoteeDto.java                 # Devotee data transfer
│   └── NotificationCampaignDto.java     # Campaign data transfer
└── exception/
    ├── GlobalExceptionHandler.java     # Error handling
    ├── ResourceNotFoundException.java  # Custom exceptions
    ├── DuplicateResourceException.java
    └── NotificationServiceException.java
```

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Maven 3.6+
- Twilio Account (for voice calls and SMS)
- WhatsApp Business API (optional)
- PostgreSQL or H2 Database

### 1. Configuration

Create `application.yml` with your Twilio credentials:

```yaml
# Twilio Configuration
twilio:
  account-sid: ${TWILIO_ACCOUNT_SID}
  auth-token: ${TWILIO_AUTH_TOKEN}
  phone-number: ${TWILIO_PHONE_NUMBER}
  webhook-url: ${WEBHOOK_URL:http://localhost:8080/api/webhooks}

# WhatsApp Business API Configuration
whatsapp:
  access-token: ${WHATSAPP_ACCESS_TOKEN}
  phone-number-id: ${WHATSAPP_PHONE_NUMBER_ID}

# Notification Configuration
notification:
  voice:
    retry-attempts: 3
    retry-delay-minutes: 30
    max-concurrent-calls: 10  # Cost control
  sms:
    retry-attempts: 2
    retry-delay-minutes: 15
  whatsapp:
    retry-attempts: 2
    retry-delay-minutes: 20
```

### 2. Environment Variables

```bash
export TWILIO_ACCOUNT_SID="your_twilio_account_sid"
export TWILIO_AUTH_TOKEN="your_twilio_auth_token"
export TWILIO_PHONE_NUMBER="+1234567890"
export WEBHOOK_URL="https://your-domain.com/api/webhooks"
export WHATSAPP_ACCESS_TOKEN="your_whatsapp_token"
export WHATSAPP_PHONE_NUMBER_ID="your_whatsapp_phone_id"
```

### 3. Build and Run

```bash
# Build the application
mvn clean install

# Run the application
mvn spring-boot:run
```

## 📞 API Endpoints

### Devotee Management
```http
# Get all devotees (paginated)
GET /api/devotees?page=0&size=20

# Get devotee by ID
GET /api/devotees/{id}

# Create new devotee
POST /api/devotees
{
  "name": "John Doe",
  "phoneNumber": "+1234567890",
  "email": "john@example.com",
  "notificationPreference": "VOICE_CALL"
}

# Update devotee
PUT /api/devotees/{id}

# Delete devotee
DELETE /api/devotees/{id}

# Search devotees
GET /api/devotees/search?query=john

# Bulk import devotees
POST /api/devotees/bulk
```

### Campaign Management
```http
# Get all campaigns
GET /api/campaigns

# Create campaign
POST /api/campaigns
{
  "name": "Amavasai Pooja 2024",
  "description": "Special pooja on Amavasai",
  "messageContent": "Tomorrow there is a pooja, please join it.",
  "notificationType": "VOICE_CALL",
  "scheduledTime": "2024-01-15T09:00:00",
  "retryEnabled": true,
  "maxRetryAttempts": 3
}

# Execute campaign immediately
POST /api/campaigns/{id}/execute

# Schedule campaign
POST /api/campaigns/{id}/schedule

# Cancel campaign
POST /api/campaigns/{id}/cancel
```

### Webhook Endpoints
```http
# Twilio voice call webhook
POST /api/webhooks/temple-voice

# Status callback
POST /api/webhooks/status

# WhatsApp webhook
POST /api/webhooks/whatsapp

# Health check
GET /api/webhooks/health
```

## 🔄 Notification Flow

### 1. Voice Call Process
```
Devotee Phone Rings → Answer → Play Message → Auto Hangup
```

### 2. Fallback Strategy
```
Voice Call Failed → Wait 30s → Send SMS → If SMS Fails → Send WhatsApp
```

### 3. Retry Logic
```
Failed Notification → Wait 5 minutes → Retry with Fallback → Repeat (max 3 attempts)
```

## 📊 Scalability Features

### Concurrent Processing
- **Voice Calls**: Limited to 10 concurrent calls (configurable)
- **SMS**: No limit, processed in batches
- **WhatsApp**: No limit, processed in batches

### Rate Limiting
- **Voice Calls**: 1 second delay between calls
- **SMS**: 500ms delay between messages
- **WhatsApp**: 500ms delay between messages

### Cost Optimization
- **Semaphore**: Limits concurrent voice calls
- **Fallback Strategy**: Reduces voice call costs
- **Batch Processing**: Efficient resource utilization

## 🛡️ Error Handling

### Exception Types
- `ResourceNotFoundException`: When devotee/campaign not found
- `DuplicateResourceException`: When phone/email already exists
- `NotificationServiceException`: When Twilio/WhatsApp service fails

### Retry Strategy
- **Voice Calls**: 3 attempts with SMS fallback
- **SMS**: 2 attempts with WhatsApp fallback
- **WhatsApp**: 2 attempts with SMS fallback

## 📈 Monitoring

### Campaign Statistics
```java
CampaignStatistics stats = templeCampaignExecutionService.getCampaignStatistics(campaignId);
System.out.println("Delivery Rate: " + stats.getDeliveryRate() + "%");
System.out.println("Total: " + stats.getTotal());
System.out.println("Delivered: " + stats.getDelivered());
System.out.println("Failed: " + stats.getFailed());
```

### Logging
- **DEBUG**: Detailed operation logs
- **INFO**: Campaign execution status
- **WARN**: Retry attempts and fallbacks
- **ERROR**: Service failures and exceptions

## 🔧 Customization

### Message Customization
Edit `TempleNotificationService.java`:
```java
// Change the default message
log.setMessageContent("Your custom temple message here");
```

### Voice Settings
Edit `TempleWebhookController.java`:
```xml
<Say voice="alice" language="en-US">
    Your custom message here
</Say>
```

### Retry Configuration
Edit `application.yml`:
```yaml
notification:
  voice:
    retry-attempts: 5        # Increase retry attempts
    max-concurrent-calls: 20  # Increase concurrent calls
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build Docker image
docker build -t temple-notification-system .

# Run with environment variables
docker run -d \
  -e TWILIO_ACCOUNT_SID=your_sid \
  -e TWILIO_AUTH_TOKEN=your_token \
  -e TWILIO_PHONE_NUMBER=your_number \
  -p 8080:8080 \
  temple-notification-system
```

### Production Considerations
1. **Database**: Use PostgreSQL for production
2. **Webhook URL**: Use HTTPS with valid SSL certificate
3. **Rate Limiting**: Adjust based on Twilio account limits
4. **Monitoring**: Set up application monitoring
5. **Backup**: Regular database backups

## 💰 Cost Estimation

### Twilio Pricing (US)
- **Voice Calls**: $0.0085/minute
- **SMS**: $0.0079/message
- **WhatsApp**: $0.0050/message

### Example: 1000 Devotees
- **Voice Calls**: 1000 × $0.0085 = $8.50
- **SMS Fallback (20%)**: 200 × $0.0079 = $1.58
- **Total Estimated Cost**: ~$10.08

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact: temple-support@example.com
- Documentation: [Wiki Link]

---

**Built with ❤️ for Temples and Devotees**
