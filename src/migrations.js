import uuid from 'an-uuid'

const migrations = [
  /*
   * Migration 1.
   * As from beginning, todo list was just an array of strings. But it leads to issues like #7, because todo items
   * cannot be unique. So this migration converts strings to hashes with id and value, where id is an unique uuid, and
   * value contains todo string.
   */
  {
    isApplicable: (data) => data && data.length > 0 && data.every(it => typeof it === 'string'),
    apply(data) {
      return data.map(item => {
        return {
          id: uuid(),
          value: item,
        }
      })
    },
  },
  /*
   * Migration 2.
   * We're moving from a single array to an object with an array of lists
   */
  {
    isApplicable: (data) => data && !data.lists,
    apply(data) {
      return {
        lists: [
          {
            id: uuid(),
            name: 'Default',
            todos: Array.isArray(data) ? data : [],
          },
        ],
        selectedListIndex: '0',
      }
    },
  },
]

export default migrations
