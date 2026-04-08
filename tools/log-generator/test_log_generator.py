import requests
import random
import time
import uuid
from datetime import datetime

INGESTION_URL = "http://localhost:8080/api/logs"

services = ["auth-service", "order-service", "payment-service", "inventory-service"]

normal_messages = [
    "User login successful",
    "Order created successfully",
    "Payment processed successfully",
    "Cache hit for user profile"
]

error_messages = [
    "Database connection timeout",
    "Payment gateway timeout",
    "Token validation failed",
    "Null pointer exception occurred"
]

critical_message = "CRITICAL: Memory leak detected in JVM"

def send_log(service, level, message, trace_id):

    payload = {
        "serviceName": service,
        "logLevel": level,
        "message": message,
        "timestamp": datetime.utcnow().isoformat(),
        "traceId": trace_id
    }

    try:
        requests.post(INGESTION_URL, json=payload)
    except:
        pass


# -------------------------------------------
# MODE 1 — Normal Traffic
# -------------------------------------------
def normal_mode():
    print("Running NORMAL mode...")
    while True:
        service = random.choice(services)
        message = random.choice(normal_messages)
        send_log(service, "INFO", message, str(uuid.uuid4()))
        time.sleep(0.1)


# -------------------------------------------
# MODE 2 — Error Spike
# -------------------------------------------
def spike_mode():
    print("Running SPIKE mode...")
    while True:
        trace_id = str(uuid.uuid4())

        # 70% errors
        if random.random() < 0.7:
            service = random.choice(services)
            message = random.choice(error_messages)
            send_log(service, "ERROR", message, trace_id)
        else:
            service = random.choice(services)
            message = random.choice(normal_messages)
            send_log(service, "INFO", message, trace_id)

        time.sleep(0.05)


# -------------------------------------------
# MODE 3 — Rare Error Mode
# -------------------------------------------
def rare_mode():
    print("Running RARE mode...")
    while True:
        trace_id = str(uuid.uuid4())

        if random.random() < 0.95:
            service = random.choice(services)
            message = random.choice(normal_messages)
            send_log(service, "INFO", message, trace_id)
        else:
            send_log("auth-service", "ERROR", "RARE: Kernel panic detected", trace_id)

        time.sleep(0.1)


# -------------------------------------------
# MODE 4 — Cascading Failure (RCA test)
# -------------------------------------------
def cascading_failure_mode():
    print("Running CASCADING FAILURE mode...")

    while True:
        trace_id = str(uuid.uuid4())

        # Root failure in auth-service
        send_log("auth-service", "ERROR", "Database connection timeout", trace_id)
        time.sleep(0.3)

        # Propagation
        send_log("order-service", "ERROR", "Downstream auth failure", trace_id)
        time.sleep(0.3)

        send_log("payment-service", "ERROR", "Auth dependency failed", trace_id)
        time.sleep(1)


# -------------------------------------------
# MODE 5 — Traffic Drop Simulation
# -------------------------------------------
def traffic_drop_mode():
    print("Running TRAFFIC DROP mode...")

    # Normal traffic first
    for _ in range(200):
        service = random.choice(services)
        send_log(service, "INFO", random.choice(normal_messages), str(uuid.uuid4()))
        time.sleep(0.05)

    print("Now dropping traffic...")
    time.sleep(30)


if __name__ == "__main__":

    print("""
Choose Mode:
1 - Normal Traffic
2 - Error Spike
3 - Rare Error
4 - Cascading Failure (RCA)
5 - Traffic Drop
""")

    choice = input("Enter mode number: ")

    if choice == "1":
        normal_mode()
    elif choice == "2":
        spike_mode()
    elif choice == "3":
        rare_mode()
    elif choice == "4":
        cascading_failure_mode()
    elif choice == "5":
        traffic_drop_mode()
    else:
        print("Invalid choice")