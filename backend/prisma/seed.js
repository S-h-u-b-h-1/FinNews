import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const seedNews = [
  {
    title: 'Tech Giants Report Record Earnings',
    description: 'Major technology companies announce their strongest quarterly results, beating market expectations.',
    category: 'Technology',
    date: 'Nov 12, 2025',
    image: '/images/tech-news.svg',
    author: 'Sarah Chen',
    readTime: '5 min read',
    claps: 2340,
    tags: ['trending']
  },
  {
    title: 'Stock Market Reaches All-Time High',
    description: 'Global markets surge as investors gain confidence in economic recovery and growth prospects.',
    category: 'Markets',
    date: 'Nov 12, 2025',
    image: '/images/market-news.svg',
    author: 'James Wilson',
    readTime: '7 min read',
    claps: 1856,
    tags: ['trending', 'featured']
  },
  {
    title: 'Cryptocurrency Volatility Continues',
    description: 'Digital assets experience significant price fluctuations amid regulatory developments.',
    category: 'Crypto',
    date: 'Nov 11, 2025',
    image: '/images/crypto-news.svg',
    author: 'Alex Morgan',
    readTime: '6 min read',
    claps: 3102,
    tags: ['trending', 'featured']
  },
  {
    title: 'Banking Sector Shows Resilience',
    description: 'Financial institutions demonstrate strong fundamentals despite economic headwinds.',
    category: 'Finance',
    date: 'Nov 11, 2025',
    image: '/images/finance-news.svg',
    author: 'Emma Richardson',
    readTime: '8 min read',
    claps: 1543,
    tags: ['featured']
  },
  {
    title: 'Oil Prices Stabilize on Supply News',
    description: 'Energy markets stabilize following announcements about production decisions.',
    category: 'Energy',
    date: 'Nov 10, 2025',
    image: '/images/energy-news.svg',
    author: 'Michael Torres',
    readTime: '5 min read',
    claps: 892,
    tags: ['featured']
  },
  {
    title: 'Real Estate Market Booms Across Regions',
    description: 'Property values surge as demand remains strong in major metropolitan areas.',
    category: 'Real Estate',
    date: 'Nov 10, 2025',
    image: '/images/realestate-news.svg',
    author: 'Lisa Anderson',
    readTime: '6 min read',
    claps: 1220,
    tags: ['featured']
  },
  {
    title: 'Central Bank Holds Interest Rates Steady',
    description: 'Monetary policy unchanged as inflation shows signs of cooling.',
    category: 'Economy',
    date: 'Nov 09, 2025',
    image: '/images/finance-news.svg',
    author: 'Daniel Kim',
    readTime: '4 min read',
    claps: 640,
    tags: ['featured']
  },
  {
    title: 'Electric Vehicles Adoption Accelerates',
    description: 'Automakers report strong demand for new EV models driving production expansion.',
    category: 'Automotive',
    date: 'Nov 09, 2025',
    image: '/images/tech-news.svg',
    author: 'Priya Patel',
    readTime: '5 min read',
    claps: 980,
    tags: ['featured']
  },
  {
    title: 'Emerging Markets Attract Foreign Investment',
    description: 'Investors pour capital into developing economies seeking higher yields.',
    category: 'Markets',
    date: 'Nov 08, 2025',
    image: '/images/market-news.svg',
    author: 'Omar Hernandez',
    readTime: '7 min read',
    claps: 410,
    tags: ['featured']
  },
  {
    title: 'Healthcare Innovation Spurs New Treatments',
    description: 'Biotech startups announce promising results from clinical trials.',
    category: 'Health',
    date: 'Nov 07, 2025',
    image: '/images/tech-news.svg',
    author: 'Rina Sato',
    readTime: '6 min read',
    claps: 1550,
    tags: ['featured']
  },
  {
    title: 'Supply Chain Improvements Ease Inflation Pressures',
    description: 'Logistics companies report smoother operations after recent upgrades.',
    category: 'Logistics',
    date: 'Nov 06, 2025',
    image: '/images/market-news.svg',
    author: 'Tom Becker',
    readTime: '5 min read',
    claps: 720,
    tags: []
  },
  {
    title: 'Tech Startups Focus on AI Safety',
    description: 'New initiatives aim to make AI models more transparent and secure.',
    category: 'Technology',
    date: 'Nov 05, 2025',
    image: '/images/tech-news.svg',
    author: 'Maya Singh',
    readTime: '8 min read',
    claps: 2920,
    tags: []
  },
  {
    title: 'Renewable Energy Investment Climbs',
    description: 'Investors increase funding in solar and wind projects worldwide.',
    category: 'Energy',
    date: 'Nov 04, 2025',
    image: '/images/energy-news.svg',
    author: 'Carlos Vega',
    readTime: '6 min read',
    claps: 810,
    tags: []
  },
  {
    title: 'Retail Sales Beat Expectations',
    description: 'Consumer spending remains strong as holiday season approaches.',
    category: 'Markets',
    date: 'Nov 03, 2025',
    image: '/images/market-news.svg',
    author: 'Nora Patel',
    readTime: '5 min read',
    claps: 430,
    tags: []
  },
  {
    title: 'Breakthrough in Cancer Research',
    description: 'Scientists report promising results from a new targeted therapy.',
    category: 'Health',
    date: 'Nov 02, 2025',
    image: '/images/tech-news.svg',
    author: 'Dr. Alan Cho',
    readTime: '9 min read',
    claps: 2200,
    tags: []
  },
  {
    title: 'Logistics Firms Adopt Automation',
    description: 'Robotics and AI streamline warehouse operations and delivery.',
    category: 'Logistics',
    date: 'Nov 01, 2025',
    image: '/images/market-news.svg',
    author: 'Greta Olson',
    readTime: '4 min read',
    claps: 610,
    tags: []
  },
  {
    title: 'New Regulations Impact Crypto Exchanges',
    description: 'Policy changes force exchanges to strengthen compliance programs.',
    category: 'Crypto',
    date: 'Oct 31, 2025',
    image: '/images/crypto-news.svg',
    author: 'Samir Rao',
    readTime: '7 min read',
    claps: 975,
    tags: []
  },
  {
    title: 'AI Tools Improve Small Business Operations',
    description: 'Affordable AI tools help small businesses optimize customer service.',
    category: 'Technology',
    date: 'Oct 30, 2025',
    image: '/images/tech-news.svg',
    author: 'Lina Hsu',
    readTime: '5 min read',
    claps: 345,
    tags: []
  },
  {
    title: 'Housing Starts Increase in Suburbs',
    description: 'New home construction picks up as developers target suburban markets.',
    category: 'Real Estate',
    date: 'Oct 29, 2025',
    image: '/images/realestate-news.svg',
    author: 'Ethan Brooks',
    readTime: '6 min read',
    claps: 512,
    tags: []
  },
  {
    title: 'Automakers Expand EV Charging Networks',
    description: 'Collaborations aim to speed up charging accessibility across regions.',
    category: 'Automotive',
    date: 'Oct 28, 2025',
    image: '/images/tech-news.svg',
    author: 'Rafael Costa',
    readTime: '5 min read',
    claps: 1225,
    tags: []
  }
];

async function main() {
  console.log('Starting to seed database...');
  
  // Clear existing data
  await prisma.news.deleteMany({});
  console.log('Cleared existing news data');

  // Seed new data
  for (const newsItem of seedNews) {
    await prisma.news.create({
      data: newsItem
    });
    console.log(`Added news: ${newsItem.title}`);
  }
  
  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });