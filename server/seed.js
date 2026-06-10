import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting optimized direct database injection...");
  const startTime = Date.now();

  // Pre-hashed bcrypt string for "password123" to save local CPU cycles
  const mockHashedPassword = "$2b$10$EpjX0ZElw9JZvSfsN9O9E.6A9bH5Jm.nF4N7K3fG.I/6W/W0Z2mGu";

  // 1. Prepare 1,000 users in memory (Removed the 'name' field to match your schema)
  console.log("👥 Generating 1,000 users with valid gmail formats...");
  const usersData = Array.from({ length: 1000 }).map((_, i) => ({
    email: `tester.user.${i}.${Date.now()}@gmail.com`, 
    password: mockHashedPassword,
    bio: `Hey, I am tester number ${i}`,
    role: "STUDENT", // Matches your Role enum
  }));

  // Bulk insert users
  await prisma.user.createMany({
    data: usersData,
    skipDuplicates: true,
  });

  // Fetch the created users to map their real UUIDs to the posts
  const allUsers = await prisma.user.findMany({ select: { id: true } });
  console.log(`✅ Successfully injected ${allUsers.length} users into the database.`);

  // 2. Prepare 10,000 posts (exactly 10 per user)
  console.log("📝 Generating 10,000 posts (exactly 10 posts per user)...");
  const postsData = [];

  let postCounter = 0;
  for (const user of allUsers) {
    for (let p = 0; p < 10; p++) {
      postsData.push({
        title: `Optimized Bench Post #${postCounter}`,
        slug: `optimized-bench-post-${postCounter}-${Date.now()}`, // Unique string for UI routing
        content: `This is the required content body text for post number ${postCounter}. It matches the db.Text specification perfectly.`,
        tags: ["benchmark", "optimization", "tech"], 
        fileUrl: `https://storage.googleapis.com/anon-app-bucket/files/asset-${postCounter}.png`,
        fileType: "image/png",
        viewCount: Math.floor(Math.random() * 100),
        published: true, 
        authorId: user.id, // Linked foreign key
      });
      postCounter++;
    }
  }

  // Bulk insert all 10,000 posts in one single database block transaction
  console.log("🚀 Pouring 10,000 posts directly into Postgres via Prisma...");
  await prisma.post.createMany({
    data: postsData,
  });

  const totalTime = (Date.now() - startTime) / 1000;
  console.log(`\n🎉 Injection fully complete!`);
  console.log(`⚡ Total items injected: 11,000 (1k users + 10k posts)`);
  console.log(`⏱️ Execution Time: ${totalTime.toFixed(2)} seconds`);
}

main()
  .catch((e) => {
    console.error("❌ Data injection aborted due to error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });