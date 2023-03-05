import { cubicOut, quadOut } from 'svelte/easing'

export function fadeScale(
  node,
  { delay = 0, duration = 400, easing = quadOut, opacity = 0 } = {}
) {
  const h = +node.offsetHeight
  const style = getComputedStyle(node)
  const target_opacity = +style.opacity
  const od = target_opacity * (1 - opacity)
  return {
    delay,
    duration,
    easing,
    css: (t, u) =>
      `height: ${t * h}px; opacity: ${
        target_opacity - od * u
      }; overflow: hidden`,
  }
}

export function flyScale(
  node,
  {
    delay = 0,
    duration = 400,
    easing = cubicOut,
    x = 0,
    y = 0,
    opacity = 0,
  } = {}
) {
  const h = +node.offsetHeight
  const style = getComputedStyle(node)
  const target_opacity = +style.opacity
  const transform = style.transform === 'none' ? '' : style.transform
  const od = target_opacity * (1 - opacity)
  return {
    delay,
    duration,
    easing,
    css: (t, u) =>
      `height: ${t * h}px; transform: ${transform} translate(${
        (1 - t) * x
      }px, ${(1 - t) * y}px);
    opacity: ${target_opacity - od * u}; overflow: hidden`,
  }
}
