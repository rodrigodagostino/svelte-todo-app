<script lang="ts">
  import Button from './Button.svelte'
  import Icon from './Icon.svelte'

  let newListTitle

  let listsData = [
    {
      id: 1677187244294,
      title: 'Task List 1',
      tasks: [
        { id: 1677187262367, title: 'Task 1', isDone: false },
        { id: 1677187264338, title: 'Task 2', isDone: false },
        { id: 1677187265836, title: 'Task 3', isDone: false },
      ],
    },
    {
      id: 1677187246719,
      title: 'Task List 2',
      tasks: [
        { id: 1677207207267, title: 'Task 1', isDone: false },
        { id: 1677207209181, title: 'Task 2', isDone: false },
        { id: 1677207211264, title: 'Task 3', isDone: false },
      ],
    },
    {
      id: 1677187250101,
      title: 'Task List 3',
      tasks: [
        { id: 1677207218772, title: 'Task 1', isDone: false },
        { id: 1677207220231, title: 'Task 2', isDone: false },
        { id: 1677207221518, title: 'Task 3', isDone: false },
      ],
    },
  ]
  let selectedListData = {
    id: 1677187244294,
    title: 'Task List 1',
    tasks: [
      { id: 1677187262367, title: 'Task 1', isDone: false },
      { id: 1677187264338, title: 'Task 2', isDone: false },
      { id: 1677187265836, title: 'Task 3', isDone: false },
    ],
  }

  const addList = () => {
    console.log('Nothing to see here @_@')
  }

  const selectList = () => {
    console.log('Nothing to see here @_@')
  }
</script>

<section class="lists-section">
  <div class="lists-content">
    {#each listsData as list}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <li
        class="list-item"
        class:is-active={list.id === selectedListData.id}
        on:click={selectList(list.id)}
      >
        <span class="list-item__handle">
          <Icon icon="grip-dots-vertical" />
        </span>
        <span class="list-item__label">{list.title}</span>
      </li>
    {/each}
    <form class="list-add" on:submit|preventDefault={addList}>
      <input bind:this={newListTitle} type="text" class="list-add__input" />
      <Button variant="dark" type="submit" icon="plus" on:click={addList} />
    </form>
  </div>
</section>

<style lang="scss">
  .lists-section {
    color: var(--white);
  }

  .list-item {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    font-size: 1.5rem;
    line-height: 1.2;
    padding: 1rem 0;
    transition: background-color 0.32s, padding 0.32s;
    cursor: pointer;

    &.is-active {
      font-weight: 600;
      color: white;
      background-color: var(--color-main--dark);
      padding: 1rem;
    }
  }

  .list-item__handle {
    flex: 0 0 auto;
    display: flex;
    padding: 0.25rem 0.5rem;
    cursor: grab;

    :global(svg circle) {
      fill: var(--color-main--lighter);
      transition: fill 0.24s;
    }

    &:focus,
    &:hover {
      :global(svg circle) {
        fill: var(--color-main--lightest);
      }
    }
  }

  .list-add {
    display: flex;
    gap: 0.25rem;
  }

  .list-add__input {
    flex: 1;
    font-size: 1.25rem;
    background-color: transparent;
    border: none;
    border-bottom: 2px solid var(--gray-100);
    outline: none;
    margin-left: 2rem;
    transition: border 0.32s;

    &:focus {
      border-bottom-color: white;
    }
  }
</style>
