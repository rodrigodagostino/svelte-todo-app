import { writable, get } from 'svelte/store'
import type { IList } from '../lib/List.svelte'
import type { ITask } from '../lib/Task.svelte'
import { addNotification } from './notifications'

interface ITodos {
  lists: IList[]
  selectedListId: number
}

export const todos = writable<ITodos>(
  {
    lists: [],
    selectedListId: null,
  },
  (set) => {
    const hasLists =
      localStorage.getItem('todos')?.charAt(0) === '[' &&
      !(localStorage.getItem('todos')?.charAt(1) === ']')
    set({
      lists: hasLists ? JSON.parse(localStorage.getItem('todos')) : [],
      selectedListId: hasLists ? JSON.parse(localStorage.getItem('todos'))[0].id : null,
    })
  }
)

export const setSelectedList = (listId: IList['id']) => {
  todos.update((currData) => ({
    ...currData,
    selectedListId: listId || null,
  }))
}

export const setLists = (value: ITodos['lists']) => {
  todos.update((currData) => ({
    ...currData,
    lists: value,
  }))
  localStorage.setItem('todos', JSON.stringify(value))
}

export const addList = (newList: IList) => {
  let $toDos
  const unsubscribe = todos.subscribe((currData) => ($toDos = currData))

  const newLists = [...$toDos.lists, newList]
  setLists(newLists)
  // Select the recently created list.
  setSelectedList($toDos.lists[$toDos.lists.length - 1].id)

  unsubscribe()
}

export const editList = (listId: IList['id'], newList: IList) => {
  const $toDos = get(todos)

  const newLists = $toDos.lists
  const targetListIndex = newLists.findIndex((list) => list.id === listId)
  newLists[targetListIndex] = newList
  setLists(newLists)
}

export const editListTitle = (listId: IList['id'], newListTitle: IList['title']) => {
  const $toDos = get(todos)

  const newLists = $toDos.lists
  const targetListIndex = newLists.findIndex((list) => list.id === listId)
  newLists[targetListIndex].title = newListTitle
  setLists(newLists)
}

export const removeList = (listId: IList['id']) => {
  const $toDos = get(todos)

  const currentList = $toDos.lists.filter((list) => list.id === listId)[0]
  addNotification('list', currentList)

  const listIndex = $toDos.lists.findIndex((list) => list.id === listId)
  // Select the previous list (if it exists) before deleting.
  if ($toDos.lists.length > 1 && listIndex !== 0) {
    setSelectedList($toDos.lists[listIndex - 1].id)
    // Select the next list (if it exists) before deleting.
  } else if ($toDos.lists.length > 1 && listIndex === 0) {
    setSelectedList($toDos.lists[listIndex + 1].id)
    // Deselect the current list before deleting.
  } else {
    setSelectedList(null)
  }

  const newLists = $toDos.lists.filter((list) => list.id !== listId)
  setLists(newLists)
}

export const addTask = (listId: IList['id'], newTask: ITask) => {
  const $toDos = get(todos)

  const newLists: IList[] = $toDos.lists
  const targetListIndex = newLists.findIndex((list) => list.id === listId)
  newLists[targetListIndex].tasks.push(newTask)
  setLists(newLists)
}

export const editTask = (
  listId: IList['id'],
  taskId: ITask['id'],
  newTaskTitle: ITask['title']
) => {
  const $toDos = get(todos)

  const newLists = $toDos.lists
  const targetListIndex = newLists.findIndex((list) => list.id === listId)
  const targetTaskIndex = newLists[targetListIndex].tasks.findIndex((task) => task.id === taskId)
  newLists[targetListIndex].tasks[targetTaskIndex].title = newTaskTitle
  setLists(newLists)
}

export const toggleTaskStatus = (listId: IList['id'], taskId: ITask['id']) => {
  const $toDos = get(todos)

  const newLists = $toDos.lists
  const targetListIndex = newLists.findIndex((list) => list.id === listId)
  const targetTaskIndex = newLists[targetListIndex].tasks.findIndex((task) => task.id === taskId)
  newLists[targetListIndex].tasks[targetTaskIndex].isDone =
    !newLists[targetListIndex].tasks[targetTaskIndex].isDone
  setLists(newLists)
}

export const removeTask = (listId: IList['id'], taskId: ITask['id']) => {
  const $toDos = get(todos)

  const currentTask = $toDos.lists
    .filter((list) => list.id === listId)[0]
    .tasks.filter((task) => task.id === taskId)[0]
  addNotification('task', {
    listId,
    id: currentTask.id,
    title: currentTask.title,
    isDone: currentTask.isDone,
  })

  const newLists = $toDos.lists
  const targetListIndex = newLists.findIndex((list) => list.id === listId)
  const targetTaskIndex = newLists[targetListIndex].tasks.findIndex((task) => task.id === taskId)
  newLists[targetListIndex].tasks.splice(targetTaskIndex, 1)
  setLists(newLists)
}
