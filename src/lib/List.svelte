<script lang="ts" context="module">
  export interface List {
    id: number
    title: string
    tasks: Task[]
  }
</script>

<script lang="ts">
  import { fade, fly } from 'svelte/transition'
  import { addTask, editList, removeList } from '../store'

  import Button from './Button.svelte'
  import Task from './Task.svelte'

  export let list: List

  let titleRef

  let isListBeingEdited = false
  let remainingTasks: string = null
  $: {
    const remaining = list.tasks.reduce(
      (total, currentValue) => (currentValue.isDone ? total + 1 : total),
      0
    )
    remainingTasks = `${remaining} task${remaining !== 1 ? 's' : ''} remaining`
  }
  let taskNewTitle = ''
  let titlePrevContent

  const handleListChanges = (action: 'confirm' | 'cancel') => {
    isListBeingEdited = false
    action === 'confirm'
      ? editList(list.id, titleRef.textContent)
      : (titleRef.textContent = titlePrevContent)
    titleRef.removeAttribute('contenteditable')
  }

  const handleOnKeydownListChanges = (event) => {
    switch (event.key) {
      case 'Enter':
        handleListChanges('confirm')
        break
      case 'Escape':
        handleListChanges('cancel')
        break
    }
  }

  const editListTitle = () => {
    titlePrevContent = titleRef.textContent
    isListBeingEdited = true
    titleRef.setAttribute('contenteditable', true)
    titleRef.focus()
  }

  const handleAddTask = () => {
    if (taskNewTitle !== '') {
      addTask(list.id, {
        id: new Date().getTime(),
        title: taskNewTitle,
        isDone: false,
      })
      taskNewTitle = ''
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
        on:keydown={(event) => handleOnKeydownListChanges(event)}
      >
        {list.title}
      </h2>
      {#if isListBeingEdited}
        <div class="list__actions">
          <Button
            variant="neutral"
            icon="check"
            on:click={() => handleListChanges('confirm')}
          />
          <Button
            variant="neutral"
            icon="times"
            on:click={() => handleListChanges('cancel')}
          />
        </div>
      {:else}
        <div class="list__actions">
          <Button variant="neutral" icon="pen" on:click={editListTitle} />
          <Button
            variant="neutral"
            icon="trash-can"
            on:click={() => removeList(list.id)}
          />
        </div>
      {/if}
    </div>
    {#if list.tasks.length}
      <div class="list__header-bottom">
        <p class="list__subhead">
          {remainingTasks}
        </p>
      </div>
    {/if}
  </header>

  <div class="list__content">
    {#each list.tasks as task (task.id)}
      <Task {task} />
    {/each}
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
        box-shadow: 0 2px 0 var(--color-main);
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
        border-bottom-color: var(--color-main);
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
