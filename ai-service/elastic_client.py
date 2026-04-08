from elasticsearch import Elasticsearch
from datetime import datetime, timedelta, timezone
from config import ELASTIC_HOST

es = Elasticsearch(ELASTIC_HOST)

LOG_INDEX_PATTERN = "logs"
ALERT_INDEX = "alerts"


# ----------------------------
# LOG FETCH (existing realtime helper)
# ----------------------------
def fetch_logs(
    size: int = 1000,
    minutes: int = None,
    start_time: str = None,
    end_time: str = None
):
    """
    Fetch logs from Elasticsearch.

    Supports:
    - Realtime mode via `minutes`
    - Historical mode via `start_time` and `end_time`
    """

    if size <= 0:
        size = 1000

    if size > 10000:
        size = 10000

    # Prevent ambiguous queries
    if minutes and (start_time or end_time):
        raise ValueError("Use either 'minutes' OR 'start_time/end_time', not both.")

    must = []

    # -----------------------------
    # Realtime mode
    # -----------------------------
    if minutes:
        now = datetime.now(timezone.utc)
        past = now - timedelta(minutes=minutes)

        must.append({
            "range": {
                "timestamp": {
                    "gte": past.isoformat(),
                    "lte": now.isoformat()
                }
            }
        })

    # -----------------------------
    # Historical mode
    # -----------------------------
    if start_time and end_time:
        must.append({
            "range": {
                "timestamp": {
                    "gte": start_time,
                    "lte": end_time
                }
            }
        })

    # -----------------------------
    # Final Query
    # -----------------------------
    query = {
        "query": {
            "bool": {
                "must": must if must else [{"match_all": {}}]
            }
        },
        "size": size,
        "sort": [
            {"timestamp": {"order": "desc"}}
        ]
    }

    response = es.search(index="logs", body=query)

    return [hit["_source"] for hit in response["hits"]["hits"]]

# ----------------------------
# GENERIC PAGINATED SEARCH
# ----------------------------
def search_with_pagination(index, query, page, size, sort_field, sort_order):

    if size > 100:
        size = 100

    if page < 1:
        page = 1

    from_ = (page - 1) * size

    body = {
        "from": from_,
        "size": size,
        "query": query,
        "sort": [
            {sort_field: {"order": sort_order}}
        ]
    }

    return es.search(index=index, body=body)


def search_with_pagination(index, query, page, size, sort_field, sort_order):

    if size > 100:
        size = 100

    if page < 1:
        page = 1

    from_ = (page - 1) * size

    body = {
        "from": from_,
        "size": size,
        "query": query,
        "sort": [
            {sort_field: {"order": sort_order}}
        ]
    }

    return es.search(index=index, body=body)

# ----------------------------
# ALERT ENGINE SUPPORT
# ----------------------------
def create_alert_index():
    if es.indices.exists(index=ALERT_INDEX):
        return

    mapping = {
        "mappings": {
            "properties": {
                "alertId": {"type": "keyword"},
                "dedupKey": {"type": "keyword"},
                "anomalyType": {"type": "keyword"},
                "rootService": {"type": "keyword"},
                "impactedServices": {"type": "keyword"},
                "severity": {"type": "keyword"},
                "status": {"type": "keyword"},
                "confidence": {"type": "float"},
                "firstDetectedAt": {"type": "date"},
                "lastUpdatedAt": {"type": "date"},
                "occurrenceCount": {"type": "integer"}
            }
        }
    }

    es.indices.create(index=ALERT_INDEX, body=mapping)


def find_alert_by_dedup_key(dedup_key):

    query = {
        "query": {
            "term": {
                "dedupKey": dedup_key
            }
        }
    }

    response = es.search(index=ALERT_INDEX, body=query)

    hits = response["hits"]["hits"]

    if not hits:
        return None

    return hits[0]


def index_alert(alert_doc):
    return es.index(index=ALERT_INDEX, document=alert_doc)


def update_alert(alert_id, update_fields):
    return es.update(
        index=ALERT_INDEX,
        id=alert_id,
        body={"doc": update_fields}
    )


def get_alert_by_id(alert_id):
    return es.get(index=ALERT_INDEX, id=alert_id)