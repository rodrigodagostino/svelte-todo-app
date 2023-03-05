<script lang="ts" context="module">
  export interface List {
    id: number
    title: string
    tasks: Task[]
  }
</script>

<script lang="ts">
  import Sortable, { type SortableOptions } from 'sortablejs'
  import { fade, fly } from 'svelte/transition'
  import { fadeScale } from '../transitions'
  import { addTask, editList, editListTitle, removeList } from '../store'

  import Button from './Button.svelte'
  import Task from './Task.svelte'

  export let id: List['id']
  export let title: List['title']
  export let tasks: List['tasks']

  let titleRef

  let isListBeingEdited = false
  let remainingTasks: string = null
  $: {
    const remaining = tasks.reduce(
      (total, currentValue) => (!currentValue.isDone ? total + 1 : total),
      0
    )
    remainingTasks = `${remaining} task${remaining !== 1 ? 's' : ''} remaining`
  }
  let taskNewTitle = ''
  let titlePrevContent

  const handleTitleChanges = (action: 'confirm' | 'cancel') => {
    isListBeingEdited = false
    action === 'confirm'
      ? editListTitle(id, titleRef.textContent)
      : (titleRef.textContent = titlePrevContent)
    titleRef.removeAttribute('contenteditable')
  }

  const handleOnKeydownTitleChanges = (event) => {
    switch (event.key) {
      case 'Enter':
        handleTitleChanges('confirm')
        break
      case 'Escape':
        handleTitleChanges('cancel')
        break
    }
  }

  const triggerTitleEdit = () => {
    titlePrevContent = titleRef.textContent
    isListBeingEdited = true
    titleRef.setAttribute('contenteditable', true)
    titleRef.focus()
  }

  const handleAddTask = () => {
    if (taskNewTitle !== '') {
      addTask(id, {
        id: new Date().getTime(),
        title: taskNewTitle,
        isDone: false,
      })
      taskNewTitle = ''
    }
  }

  const reorderArray = (array, from, to) =>
    array.splice(to, 0, array.splice(from, 1)[0])

  const sortableOptions: SortableOptions = {
    handle: '.task__handle',
    ghostClass: 'task--ghost',
    dragClass: 'task--drag',
    animation: 200,
    onUpdate: (event) => {
      reorderArray(tasks, event.oldIndex, event.newIndex)
      const currentList = { id, title, tasks }
      editList(id, currentList)
    },
  }

  const sortable = (element, options) => {
    const instance = Sortable.create(element, options)

    return {
      destroy() {
        instance.destroy
      },
    }
  }
</script>

<section
  class="list"
  in:fly={{ y: 32, duration: 320, delay: 320 }}
  out:fade={{ duration: 320 }}
>
  <header class="list__header">
    <div class="list__header-top">
      <h2
        bind:this={titleRef}
        class="list__title"
        on:keydown={(event) => handleOnKeydownTitleChanges(event)}
      >
        {title}
      </h2>
      {#if isListBeingEdited}
        <div class="list__actions">
          <Button
            variant="neutral"
            icon="check"
            on:click={() => handleTitleChanges('confirm')}
          />
          <Button
            variant="neutral"
            icon="times"
            on:click={() => handleTitleChanges('cancel')}
          />
        </div>
      {:else}
        <div class="list__actions">
          <Button variant="neutral" icon="pen" on:click={triggerTitleEdit} />
          <Button
            variant="neutral"
            icon="trash-can"
            on:click={() => removeList(id)}
          />
        </div>
      {/if}
    </div>
    {#if tasks.length}
      <div
        class="list__header-bottom"
        transition:fadeScale|local={{ duration: 320 }}
      >
        <p class="list__subhead">
          {remainingTasks}
        </p>
      </div>
    {/if}
  </header>

  <div class="list__content">
    <div class="list__tasks" use:sortable={sortableOptions}>
      {#each tasks as task (task.id)}
        <Task
          listId={id}
          id={task.id}
          title={task.title}
          isDone={task.isDone}
        />
      {/each}
    </div>
    <form class="list__form" on:submit|preventDefault={handleAddTask}>
      <input type="text" class="list__form-input" bind:value={taskNewTitle} />
      <Button variant="neutral" type="submit" icon="plus" />
    </form>
  </div>
</section>

<style lang="scss">
  .list {
    grid-column: 1;
    grid-row: 2;
    background-color: var(--white);
    max-width: 100%;
    overflow: hidden;

    &__header {
      background-color: var(--gray-100);
      padding: 1.75rem 1.5rem;
    }

    &__header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &__title {
      font-size: 2rem;
      line-height: 1;

      &:is([contenteditable='true']) {
        outline: none;
        box-shadow: 0 2px 0 var(--indigo-500);
        cursor: text;
      }
    }

    &__header-bottom {
      margin-top: 0.25rem;
    }

    &__subhead {
      font-size: 1rem;
    }

    &__actions {
      display: flex;
    }

    &__content {
      padding: 1.5rem 1.5rem 2rem;
    }

    &__form {
      display: flex;
      gap: 0.25rem;
      margin-top: 1rem;
    }

    &__form-input {
      flex: 1;
      font-size: 1.25rem;
      background-color: transparent;
      border: none;
      border-bottom: 2px solid var(--gray-400);
      margin-left: 2rem;
      outline: none;
      transition: border 0.24s;

      &:focus {
        border-bottom-color: var(--indigo-500);
      }
    }
  }

  @media screen and (min-width: 48em) {
    .list {
      grid-column: 2;
      grid-row: 1;
    }
  }
</style>
