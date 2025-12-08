import express from 'express'
import { updateComment, deleteComment } from '../controllers/commentsController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.put('/:id', protect, updateComment)
router.delete('/:id', protect, deleteComment)

export default router
