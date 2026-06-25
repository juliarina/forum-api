import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import InvariantError from '../../../Commons/exceptions/InvariantError.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';
import AuthorizationError from '../../../Commons/exceptions/AuthorizationError.js';
import pool from '../../database/postgres/pool.js';
import CommentRepositoryPostgres from '../CommentRepositoryPostgres.js';
import NewComment from '../../../Domains/comments/entities/NewComment.js';
import AddedComment from '../../../Domains/comments/entities/AddedComment.js';
import { describe, expect, it } from 'vitest';

describe('CommentRepositoryPostgres', () => {
  beforeEach(async () => {
    await CommentsTableTestHelper.addUser({ id: 'user-comment123', username: 'dicodingComment', password: 'secret', fullname: 'DicodingComment Indonesia' });
    await CommentsTableTestHelper.addThread({ id: 'thread-comment123', title: 'title', body: 'body', owner: 'user-comment123' });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanUserAndThread();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist new comment and return added comment correctly', async () => {
      // Arrange
      const newComment = new NewComment({
        content: 'content',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment('thread-comment123', 'user-comment123', newComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      const newComment = new NewComment({
        content: 'content',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment('thread-comment123', 'user-comment123', newComment);

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'content',
        owner: 'user-comment123',
      }));
    });
  });

  describe('deleteComment function', () => {
    it('should throw InvariantError when threadId not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.deleteComment('thread-comment123'))
        .rejects
        .toThrowError(InvariantError);
    });

    it('should delete comments correctly', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-comment123', content: 'content', owner:'user-comment123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteComment('comment-123');

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments[0].isDelete).toEqual(true);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should throw InvariantError when threadId not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.getCommentsByThreadId('thread-comment123'))
        .rejects
        .toThrowError(InvariantError);
    });

    it('should return comments correctly', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-comment123', content: 'content', owner:'user-comment123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-comment123');

      // Assert
      expect(comments).toEqual([{
        id: 'comment-123',
        username:'dicodingComment',
        date: expect.any(Date),
        content: 'content',
        isDelete: false,
      }]);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-comment123'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when owner and userId does not match', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-comment123', content: 'content', owner:'user-comment123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'unauthorized-user'))
        .rejects
        .toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when owner and userId matched', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-comment123', content: 'content', owner:'user-comment123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-comment123'))
        .resolves
        .not.toThrowError(AuthorizationError);
    });
  });
});