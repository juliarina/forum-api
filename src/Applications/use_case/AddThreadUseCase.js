import NewThread from '../../Domains/threads/entities/NewThread.js';

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { owner, title, body } = useCasePayload;
    const newThread = new NewThread({ title, body });
    return this._threadRepository.addThread(owner, newThread);
  }
}

export default AddThreadUseCase;