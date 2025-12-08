import { PrismaClient } from '@prisma/client'
import asyncHandler from 'express-async-handler'

const prisma = new PrismaClient()

// @desc    Get comments for a news article
// @route   GET /api/news/:id/comments
// @access  Public
export const getCommentsForNews = asyncHandler(async (req, res) => {
  const newsId = parseInt(req.params.id)
  if (Number.isNaN(newsId)) return res.status(400).json({ message: 'Invalid news id' })
  const comments = await prisma.comment.findMany({
    where: { newsId },
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { id: true, name: true, email: true } } }
  })
  res.json({ comments })
})

// @desc    Create a comment for a news article
// @route   POST /api/news/:id/comments
// @access  Private (authenticated users)
export const createComment = asyncHandler(async (req, res) => {
  const newsId = parseInt(req.params.id)
  const authorId = req.user?.sub
  const { content } = req.body
  if (!authorId) return res.status(401).json({ message: 'Authentication required' })
  if (!content || !String(content).trim()) return res.status(400).json({ message: 'Content required' })
  const news = await prisma.news.findUnique({ where: { id: newsId } })
  if (!news) return res.status(404).json({ message: 'News not found' })

  const comment = await prisma.comment.create({
    data: {
      content: String(content).trim(),
      authorId,
      newsId
    },
    include: { author: { select: { id: true, name: true, email: true } } }
  })

  res.status(201).json(comment)
})

// @desc    Update a comment
// @route   PUT /api/comments/:id
// @access  Private (owner or admin)
export const updateComment = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id)
  const userId = req.user?.sub
  const { content } = req.body
  if (!userId) return res.status(401).json({ message: 'Authentication required' })
  if (!content || !String(content).trim()) return res.status(400).json({ message: 'Content required' })

  const existing = await prisma.comment.findUnique({ where: { id } })
  if (!existing) return res.status(404).json({ message: 'Comment not found' })

  // allow if owner or admin
  const isOwner = existing.authorId === userId
  const isAdmin = req.user?.role === 'admin'
  if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Not authorized' })

  const updated = await prisma.comment.update({
    where: { id },
    data: { content: String(content).trim() },
    include: { author: { select: { id: true, name: true, email: true } } }
  })

  res.json(updated)
})

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private (owner or admin)
export const deleteComment = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id)
  const userId = req.user?.sub
  if (!userId) return res.status(401).json({ message: 'Authentication required' })

  const existing = await prisma.comment.findUnique({ where: { id } })
  if (!existing) return res.status(404).json({ message: 'Comment not found' })

  // allow if owner or admin
  const isOwner = existing.authorId === userId
  const isAdmin = req.user?.role === 'admin'
  if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Not authorized' })

  await prisma.comment.delete({ where: { id } })
  res.json({ message: 'Comment deleted' })
})

export default {
  getCommentsForNews,
  createComment,
  updateComment,
  deleteComment
}
