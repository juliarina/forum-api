class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { threadId, id, user } = useCasePayload;
    await this._threadRepository.getThreadById(threadId);
    await this._commentRepository.verifyCommentOwner(id, user);
    await this._commentRepository.deleteComment(id);
  }
}

export default DeleteCommentUseCase;