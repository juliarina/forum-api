/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool.js';

const CommentsTableTestHelper = {
  async addUser({
    id = 'user-123', username = 'dicoding', password = 'secret', fullname = 'Dicoding Indonesia',
  }) {
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4)',
      values: [id, username, password, fullname],
    };

    await pool.query(query);
  },

  async addThread({ id = 'thread-123', title = 'title', body = 'body', owner = 'user-123' }) {
    const query = {
      text: 'INSERT INTO threads(id, title, body, owner) VALUES($1, $2, $3, $4)',
      values: [id, title, body, owner]
    };

    await pool.query(query);
  },

  async addComment({ id, threadId, content, owner }) {
    const query = {
      text: 'INSERT INTO comments(id, "threadId", content, owner) VALUES($1, $2, $3, $4)',
      values: [id, threadId, content, owner]
    };

    await pool.query(query);
  },

  async findCommentsById(id = 'comment-123') {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },

  async cleanUserAndThread() {
    await pool.query('DELETE FROM threads WHERE 1=1');
    await pool.query('DELETE FROM users WHERE 1=1');
  }
};

export default CommentsTableTestHelper;