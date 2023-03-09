<script lang="ts" context="module">
  export interface Notification {
    id: number
    text: string
  }
</script>

<script lang="ts">
  import { fade } from 'svelte/transition'
  import { flyScale } from '../transitions'

  import Icon from './Icon.svelte'

  export let id: Notification['id']
  export let text: Notification['text']
</script>

<div
  id={`notification-${id}`}
  class="notification"
  in:flyScale|local={{ y: 32, duration: 320 }}
  out:fade|local={{ duration: 320 }}
>
  <div class="notification__inner">
    <p>{@html text}</p>
    <Icon icon="times" />
  </div>
</div>

<style lang="scss">
  .notification {
    &__inner {
      display: flex;
      gap: 1rem;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1rem 1rem 1.25rem;
      background-color: var(--gray-900);
      color: var(--white);
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
