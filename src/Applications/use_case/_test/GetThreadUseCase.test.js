import { expect, vi } from 'vitest';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import GetThreadUseCase from '../GetThreadUseCase.js';

describe('GetThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const id = 'thread-123';

    const mockObtainedThread = {
      id: id,
      title: 'title',
      body: 'body',
      date: new Date('2021-08-08T07:19:09.775Z'),
      username: 'dicoding',
    };

    const mockObtainedComment = [
      {
        id: 'comment-123',
        username: 'johndoe',
        date: new Date('2021-08-08T07:22:33.555Z'),
        content: 'sebuah comment'
      },
      {
        id: 'comment-124',
        username: 'dicoding',
        date: new Date('2021-08-08T07:26:21.338Z'),
        content: 'sebuah comment',
        isDelete: true,
      }
    ];

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = vi.fn()
      .mockImplementation(() => Promise.resolve(mockObtainedThread));
    mockCommentRepository.getCommentsByThreadId = vi.fn()
      .mockImplementation(() => Promise.resolve(mockObtainedComment));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository
    });

    // Action
    const addedThread = await getThreadUseCase.execute(id);

    // Assert
    expect(addedThread).toStrictEqual({
      thread: {
        id: id,
        title: 'title',
        body: 'body',
        date: expect.any(Date),
        username: 'dicoding',
        comments: [
          {
            id: 'comment-123',
            username: 'johndoe',
            date: expect.any(Date),
            content: 'sebuah comment'
          },
          {
            id: 'comment-124',
            username: 'dicoding',
            date: expect.any(Date),
            content: '**komentar telah dihapus**'
          }
        ]
      }
    });

    expect(mockThreadRepository.getThreadById).toBeCalledWith(id);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(id);
  });
});