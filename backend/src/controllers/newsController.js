import { PrismaClient } from '@prisma/client';
import asyncHandler from 'express-async-handler';

const prisma = new PrismaClient();

// @desc    Get all news articles
// @route   GET /api/news
// @access  Public
export const getNews = asyncHandler(async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      filters, // comma-separated tags
      author,
      minClaps,
      clapSort, // 'min' or 'max'
      sort, // 'newest' or 'oldest'
      q // search query
    } = req.query;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, parseInt(limit) || 10);
    const skip = (pageNum - 1) * limitNum;

    const where = {};

    // Filter by tags (any match)
    if (filters) {
      const tagsArr = String(filters).split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
      if (tagsArr.length) where.tags = { hasSome: tagsArr }
    }

    if (author) {
      where.author = { contains: String(author), mode: 'insensitive' }
    }

    if (minClaps) {
      const m = parseInt(minClaps, 10)
      if (!Number.isNaN(m)) where.claps = { gte: m }
    }

    // Full-text-ish token search across title, description, author, category
    if (q && String(q).trim()) {
      const tokens = String(q).trim().split(/\s+/).filter(Boolean)
      if (tokens.length) {
        where.AND = tokens.map((t) => {
          const token = t.trim()
          const isNum = /^\d+$/.test(token)
          const or = [
            { title: { contains: token, mode: 'insensitive' } },
            { description: { contains: token, mode: 'insensitive' } },
            { author: { contains: token, mode: 'insensitive' } },
            { category: { contains: token, mode: 'insensitive' } }
          ]
          if (isNum) {
            const n = parseInt(token, 10)
            or.push({ claps: { equals: n } })
            or.push({ readTime: { contains: token } })
          }
          return { OR: or }
        })
      }
    }

    // Build orderBy array: clap sort first (if present), then createdAt/date
    const orderBy = []
    if (clapSort && clapSort !== '') {
      if (clapSort === 'min') orderBy.push({ claps: 'asc' })
      else orderBy.push({ claps: 'desc' })
    }
    // sort by createdAt (newest/oldest)
    if (sort === 'oldest') orderBy.push({ createdAt: 'asc' })
    else orderBy.push({ createdAt: 'desc' })

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
      }),
      prisma.news.count({ where })
    ])

    res.json({
      news,
      totalPages: Math.max(1, Math.ceil(total / limitNum)),
      currentPage: pageNum,
      total
    })
  } catch (error) {
    console.error('Error fetching news:', error)
    res.status(500).json({ message: 'Failed to fetch news. Please try again.' })
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
      claps = 0,
      tags = []
    } = req.body;

    // sanitize incoming values
    const safeTags = Array.isArray(tags)
      ? tags.map(t => String(t || '').trim().toLowerCase()).filter(Boolean)
      : []
    const safeClaps = typeof claps === 'number' ? claps : Number(claps) || 0
    const safeAuthor = String(author || '').trim()

    const createdNews = await prisma.news.create({
      data: {
        title,
        description,
        category,
        date: date || new Date().toISOString().split('T')[0],
        image,
        author: safeAuthor,
        readTime,
        tags: safeTags,
        claps: safeClaps
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
