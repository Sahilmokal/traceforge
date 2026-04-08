import uuid
import hashlib
from datetime import datetime
from elasticsearch import Elasticsearch

es = Elasticsearch("http://localhost:9200")


ALERT_INDEX = "alerts"


def generate_signature(anomalies):
    raw = str(sorted(anomalies.items()))
    return hashlib.md5(raw.encode()).hexdigest()


def classify_severity(anomalies):

    if "trafficDrop" in anomalies:
        return "CRITICAL"

    if "critical" in anomalies:
        return "HIGH"

    if "errorRate" in anomalies:
        return "HIGH"

    if "spike" in anomalies:
        return "MEDIUM"

    if "rare" in anomalies:
        return "LOW"

    return "LOW"


def alert_exists(signature):

    query = {
        "query": {
            "bool": {
                "must": [
                    {"term": {"signature.keyword": signature}},
                    {"term": {"status.keyword": "NEW"}}
                ]
            }
        }
    }

    res = es.search(index=ALERT_INDEX, body=query)

    return res["hits"]["total"]["value"] > 0


def create_alert(anomalies, rca):
    signature = generate_signature(anomalies)

    if alert_exists(signature):
        return None

    root_service = rca.get("likelyRootService") if isinstance(rca, dict) else None

    anomaly_type = "anomaly_detected"
    if anomalies:
        anomaly_type = list(anomalies.keys())[0]

    alert = {
        "id": str(uuid.uuid4()),
        "firstDetectedAt": datetime.utcnow().isoformat(),
        "type": "anomaly_detected",
        "anomalyType": anomaly_type,
        "severity": classify_severity(anomalies),
        "status": "NEW",
        "anomalies": anomalies,
        "rca": rca,
        "rootService": root_service or "unknown-service",
        "confidence": 85,
        "signature": signature
    }

    es.index(index=ALERT_INDEX, id=alert["id"], body=alert)

    return alert