/* eslint valid-jsdoc:0 */ // no idea what's wrong with this jsdoc ¯\_(ツ)_/¯
import uuid from 'an-uuid'
const storage = window.localStorage

class Store {
  /**
   * Creates instance of store on the top of localStorage
   * @param storeId {String} - id to store items inside localStorage
   * @param migrations {Array} - array of migrations to apply.
   *   Every migration should have "isApplicable" and "apply" functions
   */
  constructor(storeId, migrations = []) {
    this.storeId = storeId
    const initialState = this.get()
    if (!initialState) {
      this.set({
        lists: [
          {
            id: uuid(),
            name: 'Default',
            todos: [],
          },
        ],
        selectedListIndex: 0,
      })
    }
    this.applyMigrations(migrations)
  }

  set(data) {
    data = {
      ...this.get(),
      ...data,
    }
    storage.setItem(this.storeId, JSON.stringify(data))
  }

  get() {
    const rawData = storage.getItem(this.storeId)
    return JSON.parse(rawData)
  }

  applyMigrations(migrations) {
    const migratedData = migrations.reduce((data, migration) => {
      return migration.isApplicable(data) ? migration.apply(data) : data
    }, this.get())

    this.set(migratedData)
  }
}

export default Store
