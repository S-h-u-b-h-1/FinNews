import { PrismaClient } from '@prisma/client';
import asyncHandler from 'express-async-handler';

const prisma = new PrismaClient();

// @desc    Get all news articles
// @route   GET /api/news
// @access  Public
export const getNews = asyncHandler(async (req, res) => {
  try {
    const { category, tag, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    const where = {};
    if (category) where.category = category;
    if (tag) where.tags = { has: tag };

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.news.count({ where })
    ]);

    res.json({
      news,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Failed to fetch news. Please try again.' });
  }
});

// @desc    Get single news article
// @route   GET /api/news/:id
// @access  Public
export const getNewsById = asyncHandler(async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const news = await prisma.news.findUnique({
      where: { id }
    });
    
    if (!news) {
      res.status(404).json({ message: 'News article not found' });
      return;
    }
    
    res.json(news);
  } catch (error) {
    console.error('Error fetching news article:', error);
    res.status(500).json({ message: 'Failed to fetch news article' });
  }
});

// @desc    Create a news article
// @route   POST /api/news
// @access  Private/Admin
export const createNews = asyncHandler(async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      date,
      image,
      author,
      readTime,
      tags = []
    } = req.body;

    const createdNews = await prisma.news.create({
      data: {
        title,
        description,
        category,
        date: date || new Date().toISOString().split('T')[0],
        image,
        author,
        readTime,
        tags,
        claps: 0
      }
    });

    res.status(201).json(createdNews);
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(500).json({ message: 'Failed to create news article' });
  }
});

// @desc    Update a news article
// @route   PUT /api/news/:id
// @access  Private/Admin
export const updateNews = asyncHandler(async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const {
      title,
      description,
      category,
      image,
      author,
      readTime,
      tags
    } = req.body;

    const existingNews = await prisma.news.findUnique({
      where: { id }
    });

    if (!existingNews) {
      res.status(404).json({ message: 'News article not found' });
      return;
    }

    const updatedNews = await prisma.news.update({
      where: { id },
      data: {
        title: title || existingNews.title,
        description: description || existingNews.description,
        category: category || existingNews.category,
        image: image || existingNews.image,
        author: author || existingNews.author,
        readTime: readTime || existingNews.readTime,
        tags: tags !== undefined ? tags : existingNews.tags
      }
    });

    res.json(updatedNews);
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({ message: 'Failed to update news article' });
  }
});

// @desc    Delete a news article
// @route   DELETE /api/news/:id
// @access  Private/Admin
export const deleteNews = asyncHandler(async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const news = await prisma.news.findUnique({
      where: { id }
    });

    if (!news) {
      res.status(404).json({ message: 'News article not found' });
      return;
    }

    await prisma.news.delete({
      where: { id }
    });

    res.json({ message: 'News article removed' });
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({ message: 'Failed to delete news article' });
  }
});

// @desc    Clap for a news article
// @route   POST /api/news/:id/clap
// @access  Private
export const clapNews = asyncHandler(async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const news = await prisma.news.findUnique({
      where: { id }
    });

    if (!news) {
      res.status(404).json({ message: 'News article not found' });
      return;
    }

    const updatedNews = await prisma.news.update({
      where: { id },
      data: {
        claps: news.claps + 1
      }
    });

    res.json(updatedNews);
  } catch (error) {
    console.error('Error clapping for news:', error);
    res.status(500).json({ message: 'Failed to clap for news article' });
  }
});
