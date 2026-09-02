import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Demo user 1
  const hash1 = await bcrypt.hash('demo1234', 10);
  const user1 = await prisma.user.upsert({
    where: { email: 'alex@teamtaskhub.com' },
    update: {},
    create: {
      email: 'alex@teamtaskhub.com',
      passwordHash: hash1,
      name: 'Alex Rivera',
    },
  });

  // Demo user 2
  const hash2 = await bcrypt.hash('demo1234', 10);
  const user2 = await prisma.user.upsert({
    where: { email: 'jordan@teamtaskhub.com' },
    update: {},
    create: {
      email: 'jordan@teamtaskhub.com',
      passwordHash: hash2,
      name: 'Jordan Lee',
    },
  });

  // Tasks for user1
  const tasks1 = [
    { title: 'Design onboarding flow', description: 'Create wireframes for the new user onboarding experience', priority: 'high', status: 'in_progress', assignee: 'Alex Rivera' },
    { title: 'Fix payment webhook handler', description: 'Stripe webhook returns 500 on subscription renewal events', priority: 'high', status: 'todo', assignee: 'Alex Rivera' },
    { title: 'Write API documentation', description: 'Document all REST endpoints for the developer portal', priority: 'medium', status: 'done', assignee: 'Jordan Lee' },
  ];

  for (const t of tasks1) {
    await prisma.task.upsert({
      where: { id: `seed-${user1.id}-${t.title.slice(0, 20).replace(/\s/g, '-').toLowerCase()}` },
      update: {},
      create: {
        id: `seed-${user1.id}-${t.title.slice(0, 20).replace(/\s/g, '-').toLowerCase()}`,
        ...t,
        userId: user1.id,
      },
    });
  }

  // Tasks for user2
  const tasks2 = [
    { title: 'Set up CI/CD pipeline', description: 'Configure GitHub Actions for automated testing and deployment', priority: 'medium', status: 'in_progress', assignee: 'Jordan Lee' },
    { title: 'Update dependencies', description: 'Audit and update npm packages to latest stable versions', priority: 'low', status: 'todo', assignee: 'Jordan Lee' },
    { title: 'Implement dark mode toggle', description: 'Add theme switcher component using next-themes', priority: 'low', status: 'done', assignee: 'Alex Rivera' },
  ];

  for (const t of tasks2) {
    await prisma.task.upsert({
      where: { id: `seed-${user2.id}-${t.title.slice(0, 20).replace(/\s/g, '-').toLowerCase()}` },
      update: {},
      create: {
        id: `seed-${user2.id}-${t.title.slice(0, 20).replace(/\s/g, '-').toLowerCase()}`,
        ...t,
        userId: user2.id,
      },
    });
  }

  console.log('Seeding complete!');
  console.log(`  Users: ${user1.email}, ${user2.email}`);
  console.log('  Password for both: demo1234');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
