import dns.resolver

# Explicitly use Google DNS
resolver = dns.resolver.Resolver()
resolver.nameservers = ['8.8.8.8', '8.8.4.4']

srv_queries = [
    "_mongodb._tcp.cluster0.yt7pddg.mongodb.net",
    "cluster0.yt7pddg.mongodb.net"
]

print(f"{'='*50}")
print("🔍 TESTING GOOGLE DNS (8.8.8.8) RESOLUTION")
print(f"{'='*50}")

for q in srv_queries:
    print(f"\nQuerying: {q}")
    try:
        # Try finding SRV or A records
        answers = resolver.resolve(q, 'SRV' if '_tcp' in q else 'A')
        print("✅ SUCCESS! Found records:")
        for r in answers:
            print(f"   -> {r}")
    except Exception as e:
        print(f"❌ FAILED: {e}")

print(f"\n{'='*50}")
