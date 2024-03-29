<script lang="ts" context="module">
  import type { IList } from './List.svelte';
  import type { ITask } from './Task.svelte';

  export interface Notification {
    id: number;
    type: 'list' | 'task';
    text: string;
    backup: IList | ITask;
  }
</script>

<script lang="ts">
  import { fadeScale, flyScale } from '../transitions';
  import { addList, addTask } from '../stores/todos';
  import { removeNotification } from '../stores/notifications';

  import Button from './Button.svelte';

  export let id: Notification['id'];
  export let type: Notification['type'];
  export let text: Notification['text'];
  export let backup: Notification['backup'];

  const undoRemoval = () => {
    type === 'list' ? addList(backup as IList) : addTask(backup['listId'], backup as ITask);
    removeNotification(id);
  };
</script>

<div
  id={`notification-${id}`}
  class="notification"
  in:flyScale={{ y: 32, duration: 320 }}
  out:fadeScale={{ duration: 320 }}
>
  <div class="notification__inner">
    <p class="notification__text" role="status">
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html text}
    </p>
    <Button variant="neutral-dark" on:click|once={undoRemoval}>Undo</Button>
    <Button variant="ghost-dark" icon="times" on:click|once={() => removeNotification(id)} />
  </div>
</div>

<style lang="scss">
  .notification {
    &__inner {
      display: flex;
      gap: 1rem;
      align-items: center;
      padding: 0.75rem 1rem 0.75rem 1.5rem;
      background-color: var(--gray-900);
      color: var(--gray-050);
      position: relative;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 0.25rem;
        background-color: var(--indigo-600);
        animation: progress 8s linear forwards;
      }
    }

    &__text {
      :global(strong) {
        color: var(--white-rich);
        font-weight: 600;
      }
    }

    :global(.button) {
      flex: 0 0 auto;
    }
  }

  @keyframes progress {
    0% {
      width: 100%;
    }
    100% {
      width: 0;
    }
  }
</style>
