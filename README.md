# TraceForge AI — Intelligent Log Monitoring & Automated Root Cause Analysis

## 🚀 Problem Statement

Modern distributed systems generate massive volumes of logs across multiple services. Debugging failures becomes extremely difficult due to:

* Lack of centralized log visibility
* Difficulty in identifying anomalies in real-time
* Complex failure propagation across services
* Manual root cause analysis

TraceForge AI solves this by providing an **AI-assisted log monitoring platform** that detects anomalies and automatically identifies probable root causes.


## 🛠️ Tech Stack

### Backend

* Java (Spring Boot)
* Python (FastAPI)

### Streaming & Storage

* Kafka
* Elasticsearch

### AI / Intelligence Layer

* TF-IDF Vectorization
* DBSCAN Clustering (Unsupervised Learning)
* Statistical Anomaly Detection
* Trace-based Root Cause Analysis

### DevOps

* Docker & Docker Compose
* AWS EC2 Deployment
* Nginx Reverse Proxy
* GitHub Actions (CI/CD)

---

## 🧠 How This Is AI-Driven

TraceForge AI applies **unsupervised machine learning and statistical analysis**:

* Log messages are vectorized using TF-IDF
* DBSCAN groups similar log patterns dynamically
* Anomaly detection identifies:

  * High error rates
  * Traffic drops
  * Rare log patterns
  * Sudden spikes
* RCA engine correlates failures using:

  * traceId
  * timestamp ordering
  * propagation window

---

## ⚙️ Key Features

* Real-time log ingestion pipeline
* Distributed log processing via Kafka
* Intelligent anomaly detection
* Automated Root Cause Analysis (RCA)
* Alert generation with severity & lifecycle
* Interactive dashboard for monitoring

---

## 🚀 Deployment

The system is fully containerized and deployed using Docker Compose.

### Run locally:

```
docker-compose up --build
```

### AWS Deployment:

* Deployed on EC2 instance
* Services exposed via Nginx reverse proxy
* Elastic IP used for stable access

---

## 🔐 Multi-Tenancy (Design Consideration)

Current implementation is **single-tenant** for simplicity.

In production, multi-tenancy can be implemented using:

* tenantId tagging in logs
* Elasticsearch query filtering
* Separate indices per tenant

---

## ⚖️ Design Decisions

### Why Kafka?

* Decouples ingestion from processing
* Handles high throughput
* Enables scalability

### Why Elasticsearch?

* Fast log search
* Time-based indexing
* Suitable for observability systems

### Why DBSCAN over KMeans?

* No need to predefine number of clusters
* Detects noise (rare logs) naturally
* Works better for dynamic log patterns

---

## ⚠️ Trade-offs

* DBSCAN performance degrades with very large datasets
* Elasticsearch requires significant memory
* No deep learning (focus is on practical ML)
* Simplified deployment (single-node setup)

---

## 📈 Scalability Discussion

To scale the system:

* Kafka can be partitioned across brokers
* Log processors can be horizontally scaled
* Elasticsearch can be clustered
* AI service can be deployed as multiple workers

For high throughput systems (1M logs/min), bottlenecks would be:

* Elasticsearch indexing
* Kafka throughput limits
* Network I/O

---

## 🧪 Failure Simulation

The system was tested under:

* High log volume
* Error spikes
* Rare error injection
* Service failure propagation

Results:

* Anomalies detected correctly
* RCA identified root services with confidence score
* Alerts triggered appropriately

---

## 📊 Example RCA Output

```
Root Service: inventory-service  
Impacted Services: order-service  
Reason: Database timeout  
Confidence: 0.47  
```

---

## 🔮 Future Improvements

* Replace DBSCAN with streaming clustering
* Add OpenTelemetry integration
* Implement real-time stream processing
* Add authentication & multi-tenant support
* Introduce LLM-based log summarization
* Improve anomaly confidence modeling

---

## 💰 Cost Optimization

The system is deployed using on-demand EC2:

* Instance is stopped when not in use
* Only storage cost persists
* Reduces monthly cost to ~₹200–₹350

---

## 🎯 Conclusion

TraceForge AI demonstrates a **production-style observability platform** combining:

* Distributed systems design
* Machine learning
* Real-time processing
* Cloud deployment

This project focuses on **practical engineering trade-offs and scalable architecture** rather than academic complexity.
