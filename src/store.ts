import { writable } from 'svelte/store'
import type { List } from './lib/List.svelte'

interface ToDos {
  lists: List[]
  selectedList: List
  selectedListId: number
}

const hasLists =
  localStorage.getItem('todos') &&
  localStorage.getItem('todos').charAt(0) === '['

export const toDos = writable<ToDos>({
  lists: hasLists ? JSON.parse(localStorage.getItem('todos')) : [],
  selectedList: hasLists ? JSON.parse(localStorage.getItem('todos'))[0] : null,
  selectedListId: hasLists
    ? JSON.parse(localStorage.getItem('todos'))[0].id
    : null,
})

export const setSelectedList = (listId) => {
  toDos.update((currData) => ({
    ...currData,
    selectedListId: listId || null,
  }))
}

const setLists = (value) => {
  toDos.update((currData) => ({
    ...currData,
    lists: value,
  }))
  localStorage.setItem('todos', JSON.stringify(value))
}

export const addList = (newList) => {
  let toDosRef
  toDos.subscribe((currData) => (toDosRef = currData))

  const newLists = toDosRef.lists ? [...toDosRef.lists, newList] : [newList]
  setLists(newLists)
  // Select the recently created list.
  setSelectedList(toDosRef.lists[toDosRef.lists.length - 1].id)
}

export const editList = (listId, newListTitle) => {
  let toDosRef
  toDos.subscribe((currData) => (toDosRef = currData))

  const newLists = toDosRef.lists
  const targetListIndex = newLists.findIndex((list) => list.id === listId)
  newLists[targetListIndex].title = newListTitle
  setLists(newLists)
}

export const removeList = (listId) => {
  let toDosRef
  toDos.subscribe((currData) => (toDosRef = currData))

  const listIndex = toDosRef.lists.findIndex((list) => list.id === listId)
  // Select the previous list (if it exists) before deleting.
  if (toDosRef.lists.length > 1 && listIndex !== 0) {
    setSelectedList(toDosRef.lists[listIndex - 1].id)
    // Select the next list (if it exists) before deleting.
  } else if (toDosRef.lists.length > 1 && listIndex === 0) {
    setSelectedList(toDosRef.lists[listIndex + 1].id)
    // Deselect the current list before deleting.
  } else {
    setSelectedList(null)
  }
  const newLists = toDosRef.lists.filter((list) => {
    return list.id !== listId
  })
  setLists(newLists)
}

export const addTask = (listId, newTaskData) => {
  let toDosRef
  toDos.subscribe((currData) => (toDosRef = currData))

  const newLists = toDosRef.lists
  const targetListIndex = newLists.findIndex((list) => list.id === listId)
  newLists[targetListIndex].tasks.push(newTaskData)
  setLists(newLists)
}

export const editTask = (listId, taskId, newTaskTitle) => {
  let toDosRef
  toDos.subscribe((currData) => (toDosRef = currData))

  const newLists = toDosRef.lists
  const targetListIndex = newLists.findIndex((list) => list.id === listId)
  const targetTaskIndex = newLists[targetListIndex].tasks.findIndex(
    (task) => task.id === taskId
  )
  newLists[targetListIndex].tasks[targetTaskIndex].title = newTaskTitle
  setLists(newLists)
}

export const toggleTaskStatus = (listId, taskId) => {
  let toDosRef
  toDos.subscribe((currData) => (toDosRef = currData))

  const newLists = toDosRef.lists
  const targetListIndex = newLists.findIndex((list) => list.id === listId)
  const targetTaskIndex = newLists[targetListIndex].tasks.findIndex(
    (task) => task.id === taskId
  )
  newLists[targetListIndex].tasks[targetTaskIndex].isDone =
    !newLists[targetListIndex].tasks[targetTaskIndex].isDone
  setLists(newLists)
}

export const removeTask = (listId, taskId) => {
  let toDosRef
  toDos.subscribe((currData) => (toDosRef = currData))

  const newLists = toDosRef.lists
  const targetListIndex = newLists.findIndex((list) => list.id === listId)
  const targetTaskIndex = newLists[targetListIndex].tasks.findIndex(
    (task) => task.id === taskId
  )
  newLists[targetListIndex].tasks.splice(targetTaskIndex, 1)
  setLists(newLists)
}
