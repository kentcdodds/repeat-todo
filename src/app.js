import React, {PropTypes as pt} from 'react'
import ReactDOM from 'react-dom'
import uuid from 'an-uuid'
import {arrayMoveToEnd, arrayRemoveElement} from './utils'
import TodoList from './todo-list'
import ListChooser from './list-chooser'
import Store from './store'
import migrations from './migrations'

const App = React.createClass({
  propTypes: {
    store: pt.shape({
      get: pt.func,
      set: pt.func,
    }).isRequired,
  },
  getInitialState() {
    return {todoList: {lists: [], selectedListIndex: 0}}
  },
  componentDidMount() {
    this._updateStateFromStore()
  },
  render() {
    const {lists, selectedListIndex} = this.state.todoList
    console.log('rendering', this.state.todoList)
    return (
      <div>
        <h1>Repeat Todo</h1>
        <ListChooser
          lists={lists}
          selectedListIndex={selectedListIndex}
          onAddList={this._onAddList}
          onChange={this._onSelectedListChange}
        />
        {
          lists && lists[selectedListIndex] !== undefined ? (
            <TodoList
              todoList={lists[selectedListIndex]}
              onAddTodo={this._onAddTodo}
              onCompleteTodo={this._onCompleteTodo}
              onDeleteTodo={this._onDeleteTodo}
              onDeleteList={this._onDeleteList}
              onRenameList={this._onRenameList}
            />
          ) : null
        }
      </div>
    )
  },
  _onAddList(name) {
    const list = {name, todos: [], id: uuid()}
    const {todoList} = this.state
    this.setState({
      todoList: {
        ...todoList,
        selectedListIndex: todoList.lists.length.toString(),
        lists: [...todoList.lists, list],
      },
    }, () => {
      this._updateStoreAndState()
    })
  },
  _onDeleteList(list) {
    const {lists} = this.state.todoList
    const index = lists.indexOf(list)
    const newLists = arrayRemoveElement(lists, index)
    this.setState({
      todoList: {
        ...this.state.todoList,
        selectedListIndex: '0',
        lists: newLists,
      },
    }, () => {
      this._updateStoreAndState()
    })
  },
  _onRenameList(list, newName) {
    list.name = newName
    this._updateStoreAndState()
  },
  _onAddTodo(val) {
    const {lists, selectedListIndex} = this.state.todoList
    const list = lists[selectedListIndex]
    const newItem = {id: uuid(), value: val}
    list.todos.unshift(newItem)
    this._updateStoreAndState()
  },
  _onCompleteTodo(currentIndex) {
    const {lists, selectedListIndex} = this.state.todoList
    const list = lists[selectedListIndex]
    list.todos = arrayMoveToEnd(list.todos, currentIndex)
    this._updateStoreAndState()
  },
  _onDeleteTodo(index) {
    const {lists, selectedListIndex} = this.state.todoList
    const list = lists[selectedListIndex]
    list.todos = arrayRemoveElement(list.todos, index)
    this._updateStoreAndState()
  },
  _onSelectedListChange(selectedListIndex) {
    this.setState({
      todoList: {
        ...this.state.todoList,
        selectedListIndex,
      },
    }, () => {
      this._updateStoreAndState()
    })
  },
  _updateStoreAndState() {
    this._updateStore()
    this._updateStateFromStore()
  },
  _updateStore() {
    const {lists, selectedListIndex} = this.state.todoList
    this.props.store.set({lists, selectedListIndex})
  },
  _updateStateFromStore() {
    const todoList = this.props.store.get() || {lists: [], selectedListIndex: 0}
    this.setState({todoList})
  },
})

ReactDOM.render(
  <App store={new Store('todoList', migrations)} />,
  document.getElementById('app')
)

