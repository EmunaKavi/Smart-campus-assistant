import os
import dns.resolver
from pymongo import MongoClient
from pymongo.server_api import ServerApi, ServerApiVersion
import sys

# The URI from your database.py
URI = "mongodb+srv://gk5139272_db_user:0OhJkotGM6B0sG9r@cluster0.yt7pddg.mongodb.net/?appName=Cluster0"
DOMAIN = "cluster0.yt7pddg.mongodb.net"

print(f"{'='*50}")
print("🔍 MONGODB CONNECTION DIAGNOSTIC TOOL")
print(f"{'='*50}\n")

# STEP 1: DNS Resolution
print(f"1. Testing DNS Resolution for {DOMAIN}...")
try:
    answers = dns.resolver.resolve(DOMAIN, 'A')
    print("   ✅ DNS A-Record Resolved:")
    for rdata in answers:
        print(f"      - {rdata}")
except Exception as e:
    print(f"   ❌ DNS Resolution Failed: {e}")
    print("      -> This confirms a DNS or Internet issue.")

print("-" * 30)

# STEP 2: Connection Test
print("2. Testing PyMongo Connection...")
try:
    print("   -> Attempting to connect (timeout=10s)...")
    client = MongoClient(
        URI,
        server_api=ServerApi(ServerApiVersion.V1),
        connectTimeoutMS=10000,
        socketTimeoutMS=10000
    )
    # Force a network call
    info = client.admin.command('ping')
    print("\n   ✅ SUCCESS! Connected to MongoDB.")
    print(f"   -> Server Version: {info.get('version')}")
    
except Exception as e:
    print(f"\n   ❌ CONNECTION FAILED: {type(e).__name__}")
    print(f"   -> Error: {e}")
    
    if "10060" in str(e):
        print("\n   🚨 DIAGNOSIS: [WinError 10060] TIMEOUT")
        print("   -> CAUSE: Your IP Address is BLOCKED by MongoDB Atlas.")
        print("   -> FIX: Go to Atlas > Network Access > Add IP Address > Allow Access from Anywhere.")
    elif "DNS" in str(e) or "ConfigurationError" in str(e):
        print("\n   🚨 DIAGNOSIS: DNS FAILURE")
        print("   -> CAUSE: Your DNS cannot find the MongoDB server.")
        print("   -> FIX: Change DNS to 8.8.8.8 or flush DNS cache.")

print(f"\n{'='*50}")
