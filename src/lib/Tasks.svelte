<script lang="ts">
  import { fade, fly } from 'svelte/transition'
  import { addTask, editList, removeList, toDos } from '../store'

  import Button from './Button.svelte'
  import Task from './Task.svelte'

  $: selectedList = $toDos.selectedListId
    ? $toDos.lists.filter((list) => list.id === $toDos.selectedListId)[0]
    : null
  let isListBeingEdited = false
  let remainingTasks: string = null
  $: {
    let remaining = 0
    for (const task of selectedList.tasks) {
      if (!task.isDone) remaining++
    }
    remainingTasks = `${remaining} task${remaining !== 1 ? 's' : ''} remaining`
  }
  let taskNewTitle = ''
  let titlePrevContent

  let title

  const handleListChanges = (action: 'confirm' | 'cancel') => {
    isListBeingEdited = false
    action === 'confirm'
      ? editList(selectedList.id, title.textContent)
      : (title.textContent = titlePrevContent)
    title.removeAttribute('contenteditable')
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
    titlePrevContent = title.textContent
    isListBeingEdited = true
    title.setAttribute('contenteditable', true)
    title.focus()
  }

  const handleAddTask = () => {
    if (taskNewTitle !== '') {
      addTask(selectedList.id, {
        id: new Date().getTime(),
        title: taskNewTitle,
        isDone: false,
      })
      taskNewTitle = ''
    }
  }
</script>

{#key selectedList.id}
  <section
    class="tasks"
    in:fly={{ y: 32, duration: 320, delay: 320 }}
    out:fade={{ duration: 320 }}
  >
    <header class="tasks__header">
      <div class="tasks__header-top">
        <h2
          bind:this={title}
          class="tasks__title"
          on:keydown={(event) => handleOnKeydownListChanges(event)}
        >
          {selectedList.title}
        </h2>
        {#if isListBeingEdited}
          <div class="tasks__actions">
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
          <div class="tasks__actions">
            <Button variant="neutral" icon="pen" on:click={editListTitle} />
            <Button
              variant="neutral"
              icon="trash-can"
              on:click={() => removeList(selectedList.id)}
            />
          </div>
        {/if}
      </div>
      {#if selectedList.tasks.length}
        <div class="tasks__header-bottom">
          <p class="tasks__subhead">
            {remainingTasks}
          </p>
        </div>
      {/if}
    </header>

    <div class="tasks__content">
      {#if selectedList}
        {#each selectedList.tasks as task}
          <Task {task} />
        {/each}
      {/if}
      <form class="tasks__add-form" on:submit|preventDefault={handleAddTask}>
        <input
          type="text"
          class="tasks__add-form-input"
          bind:value={taskNewTitle}
        />
        <Button variant="neutral" type="submit" icon="plus" />
      </form>
    </div>
  </section>
{/key}

<style lang="scss">
  .tasks {
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

    &__add-form {
      display: flex;
      gap: 0.25rem;
      margin-top: 1rem;
    }

    &__add-form-input {
      flex: 1;
      font-size: 1.25rem;
      background-color: transparent;
      border: none;
      border-bottom: 2px solid var(--gray-400);
      margin-left: 2rem;
      outline: none;
      transition: border 0.32s;

      &:focus {
        border-bottom-color: var(--color-main);
      }
    }
  }

  @media screen and (min-width: 48em) {
    .tasks {
      grid-column: 2;
      grid-row: 1;
    }
  }
</style>
