import mongoose from 'mongoose';
import News from './models/News.js';
import dotenv from 'dotenv';

dotenv.config();

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
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear existing data and insert seed data
    await News.deleteMany({});
    const createdNews = await News.insertMany(seedNews);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
