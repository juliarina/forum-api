import express from 'express';
import authenticateToken from '../../../../Infrastructures/middleware/authentications.js';

const createThreadsRouter = (handler, container) => {
  const router = express.Router();

  router.post('/', authenticateToken(container), handler.postThreadHandler);
  router.post('/:threadId/comments', authenticateToken(container), handler.postCommentHandler);
  router.delete('/:threadId/comments/:commentId', authenticateToken(container), handler.deleteCommentHandler);
  router.get('/:threadId', handler.getThreadHandler);

  return router;
};

export default createThreadsRouter;