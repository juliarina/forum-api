import NewComment from '../../Domains/comments/entities/NewComment.js';

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { threadId, owner, content } = useCasePayload;
    const newComment = new NewComment({ content });
    await this._threadRepository.getThreadById(threadId);
    return this._commentRepository.addComment(threadId, owner, newComment);
  }
}

export default AddCommentUseCase;