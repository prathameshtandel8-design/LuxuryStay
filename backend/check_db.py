import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import sys

# Usage: python check_db.py "your_mongodb_connection_string"

async def check_connection(mongo_url):
    if not mongo_url:
        print("❌ Error: No connection string provided.")
        print("Usage: python check_db.py \"<your_mongodb_url>\"")
        return

    print(f"🔄 Attempting to connect to: {mongo_url}")
    
    try:
        client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=5000)
        # The is_master command is cheap and does not require auth.
        await client.admin.command('ping')
        print("✅ SUCCESS! Connected to MongoDB Atlas.")
        print(f"   Server version: {(await client.server_info())['version']}")
    except Exception as e:
        print(f"❌ FAILED to connect.")
        print(f"   Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    url = sys.argv[1] if len(sys.argv) > 1 else input("Enter your MongoDB connection string: ").strip()
    asyncio.run(check_connection(url))
