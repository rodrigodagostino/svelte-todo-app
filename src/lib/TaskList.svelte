<script lang="ts">
  import Button from './Button.svelte'
  import TaskListItem from './TaskListItem.svelte'

  let title

  let selectedListData = {
    id: 1677187244294,
    title: 'Task List 1',
    tasks: [
      { id: 1677187262367, title: 'Task 1', isDone: false },
      { id: 1677187264338, title: 'Task 2', isDone: false },
      { id: 1677187265836, title: 'Task 3', isDone: false },
    ],
  }
  let isListBeingEdited = false
  $: remainingTasks = '3 tasks remaining'
  let newTaskTitle = ''

  const confirmListChanges = () => {
    console.log('Nothing to see here @_@')
  }

  const cancelListChanges = () => {
    console.log('Nothing to see here @_@')
  }

  const editListTitle = () => {
    console.log('Nothing to see here @_@')
  }

  const removeList = () => {
    console.log('Nothing to see here @_@')
  }

  const addTask = () => {
    console.log('Nothing to see here @_@')
  }
</script>

<section class="tasks-section">
  <header class="tasks-header">
    <div class="tasks-header__top">
      <h2
        bind:this={title}
        class="tasks-header__title"
        on:keydown={confirmListChanges}
        on:keydown={cancelListChanges}
      >
        {selectedListData.title}
      </h2>
      {#if isListBeingEdited}
        <div class="tasks-header__actions">
          <Button
            variant="neutral"
            icon="check"
            on:click={confirmListChanges}
          />
          <Button variant="neutral" icon="xmark" on:click={cancelListChanges} />
        </div>
      {:else}
        <div class="tasks-header__actions">
          <Button variant="neutral" icon="pen" on:click={editListTitle} />
          <Button variant="neutral" icon="trash-can" on:click={removeList} />
        </div>
      {/if}
    </div>
    {#if selectedListData.tasks}
      <div class="tasks-header__bottom">
        <p class="tasks-header__subhead">
          {remainingTasks}
        </p>
      </div>
    {/if}
  </header>

  <div class="tasks-content">
    {#each selectedListData.tasks as task}
      <TaskListItem {task} />
    {/each}
    <form class="task-add" on:submit|preventDefault={addTask}>
      <input type="text" class="task-add__input" bind:value={newTaskTitle} />
      <Button variant="neutral" type="submit" icon="plus" />
    </form>
  </div>
</section>

<style lang="scss">
  .tasks-section {
    background-color: var(--white);
    max-width: 100%;
    overflow: hidden;

    .tasks-header {
      background-color: var(--gray-100);
      padding: 1.75rem 1.5rem;

      &__top {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      &__title {
        font-size: 2rem;
        line-height: 1;

        &[contenteditable='true'] {
          outline: none;
          box-shadow: 0 2px 0 var(--color-main);
          cursor: text;
        }
      }

      &__bottom {
        margin-top: 0.25rem;
      }

      &__subhead {
        font-size: 1rem;
      }

      &__actions {
        display: flex;
      }
    }

    .tasks-content {
      padding: 1.5rem 1.5rem 2rem;
    }
  }

  .task-list {
    list-style-type: none;
  }

  .task-add {
    display: flex;
    gap: 0.25rem;
    margin-top: 1rem;

    .task-add__input {
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
</style>
