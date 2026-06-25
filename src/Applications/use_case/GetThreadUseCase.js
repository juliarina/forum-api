class GetThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const thread = await this._threadRepository.getThreadById(useCasePayload);
    const comments = await this._commentRepository.getCommentsByThreadId(useCasePayload);
    const modifiedComments = comments.map(({ id, username, date, content, isDelete }) => ({
      id,
      username,
      date,
      content: isDelete ? '**komentar telah dihapus**' : content,
    }));

    return {
      thread: {
        ...thread,
        comments: modifiedComments,
      }
    };
  }
}

export default GetThreadUseCase;