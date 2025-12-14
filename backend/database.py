import os
from pymongo import MongoClient
from pymongo.server_api import ServerApi, ServerApiVersion
from dotenv import load_dotenv

load_dotenv()

import certifi

# DIRECT CONNECTION (Bypassing DNS SRV Lookup)
# Addresses extracted from previous error logs
MONGO_URI_DIRECT = (
    "mongodb://gk5139272_db_user:0OhJkotGM6B0sG9r"
    "@ac-lfxuyux-shard-00-00.yt7pddg.mongodb.net:27017,"
    "ac-lfxuyux-shard-00-01.yt7pddg.mongodb.net:27017,"
    "ac-lfxuyux-shard-00-02.yt7pddg.mongodb.net:27017"
    "/?ssl=true&authSource=admin&appName=Cluster0"
)

MONGO_URI = os.getenv("MONGO_URI", MONGO_URI_DIRECT)

client = MongoClient(
    MONGO_URI, 
    server_api=ServerApi(ServerApiVersion.V1),
    connectTimeoutMS=30000,
    socketTimeoutMS=30000,
    retryWrites=True,
    retryReads=True,
    tlsCAFile=certifi.where()
)

try:
    # Send a ping to confirm a successful connection
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(f"MongoDB connection error: {e}")

db = client["smart_campus_db"]
users_collection = db["users"]