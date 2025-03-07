<script lang="ts">
	import { formatCurrency, formatNumber } from '$lib/utils/formatters';
	import clamp from '$lib/utils/numbers';
	import type { Currencies } from '$lib/utils/postConstants';

	type Props = {
		start?: number;
		end?: number;
		min?: number;
		max?: number;
		currency?: Currencies;
	};

	let { start = $bindable(0), end = $bindable(1), min, max, currency }: Props = $props();
	let leftHandle: HTMLDivElement | undefined = $state();
	let body: HTMLDivElement | undefined = $state();
	let slider: HTMLDivElement | undefined = $state();

	function formatValues(value: number, toFixed: number) {
		if (currency) {
			return formatCurrency(value, currency, toFixed);
		}
		return formatNumber(value, toFixed);
	}

	function draggable(node: HTMLElement) {
		let x: number;
		let y: number;

		function handleStart(event: MouseEvent | TouchEvent) {
			const coords = getEventCords(event);
			x = coords.x;
			y = coords.y;

			node.dispatchEvent(
				new CustomEvent('dragstart', {
					detail: { x, y }
				})
			);

			const moveEvent = event.type === 'touchstart' ? 'touchmove' : 'mousemove';
			const endEvent = event.type === 'touchstart' ? 'touchend' : 'mouseup';

			const moveHandler = (moveEvent: MouseEvent | TouchEvent) => {
				const coords = getEventCords(moveEvent);
				const dx = coords.x - x;
				const dy = coords.y - y;
				x = coords.x;
				y = coords.y;
				node.dispatchEvent(
					new CustomEvent('dragmove', {
						detail: { x, y, dx, dy }
					})
				);
			};

			const endHandler = (endEvent: MouseEvent | TouchEvent) => {
				const coords = getEventCords(endEvent);
				x = coords.x;
				y = coords.y;
				node.dispatchEvent(
					new CustomEvent('dragend', {
						detail: { x, y }
					})
				);
				window.removeEventListener(moveEvent, moveHandler);
				window.removeEventListener(endEvent, endHandler);
			};

			window.addEventListener(moveEvent, moveHandler);
			window.addEventListener(endEvent, endHandler);
		}

		node.addEventListener('mousedown', handleStart);
		node.addEventListener('touchstart', handleStart);

		return {
			destroy() {
				node.removeEventListener('mousedown', handleStart);
				node.removeEventListener('touchstart', handleStart);
			}
		};
	}

	function getEventCords(event: MouseEvent | TouchEvent) {
		let evt: MouseEvent | Touch;
		if (event.type.startsWith('touch')) {
			evt = (event as TouchEvent).changedTouches[0];
		} else {
			evt = event as MouseEvent;
		}
		return { x: evt.clientX, y: evt.clientY };
	}

	function setHandlePosition(which: 'start' | 'end') {
		return function (event: MouseEvent | TouchEvent) {
			event.preventDefault();
			event.stopPropagation();
			if (!slider) return;
			const { detail } = event;
			const { left, right } = slider.getBoundingClientRect();
			const parentWidth = right - left;
			const p = Math.min(Math.max((detail.x - left) / parentWidth, 0), 1);
			if (which === 'start') {
				start = p;
				end = Math.max(end, p);
			} else {
				start = Math.min(p, start);
				end = p;
			}
		};
	}
	function setHandlesFromBody(event: MouseEvent | TouchEvent) {
		event.preventDefault();
		event.stopPropagation();
		if (!slider || !body || !leftHandle) return;
		const { width } = body.getBoundingClientRect();
		const { left, right } = slider.getBoundingClientRect();
		const parentWidth = right - left;
		const leftHandleLeft = leftHandle.getBoundingClientRect().left;
		const pxStart = clamp(leftHandleLeft + event.detail.dx - left, 0, parentWidth - width);
		const pxEnd = clamp(pxStart + width, width, parentWidth);
		const pStart = pxStart / parentWidth;
		const pEnd = pxEnd / parentWidth;
		start = pStart;
		end = pEnd;
	}
</script>

<div class="w-full h-5 select-none box-border whitespace-nowrap">
	<div
		class="relative w-full h-1.5 top-1/2 -translate-y-1/2 bg-gray-200 rounded-xs"
		bind:this={slider}
	>
		<div
			class="absolute top-0 bottom-0 bg-yellow-500"
			bind:this={body}
			use:draggable
			ondragmove={setHandlesFromBody}
			style="
				left: {100 * start}%;
				right: {100 * (1 - end)}%;
			"
		></div>

		<div
			class="handle"
			bind:this={leftHandle}
			data-which="start"
			use:draggable
			ondragmove={setHandlePosition('start')}
			style="
				left: {100 * start}%
			"
		></div>
		<div
			class="handle"
			data-which="end"
			use:draggable
			ondragmove={setHandlePosition('end')}
			style="
				left: {100 * end}%
			"
		></div>
	</div>
	<div class="flex justify-between mt-5">
		<span>{min !== undefined ? formatValues(min, 0) : start}</span>
		<span>{max !== undefined ? formatValues(max, 0) : end}</span>
	</div>
</div>

<style>
	.handle {
		position: absolute;
		top: 50%;
		width: 0;
		height: 0;
	}
	.handle:after {
		content: ' ';
		box-sizing: border-box;
		position: absolute;
		border-radius: 50%;
		width: 24px;
		height: 24px;
		background-color: #fdfdfd;
		border: 1px solid #7b7b7b;
		transform: translate(-50%, -50%);
	}
	/* .handle[data-which="end"]:after{
		transform: translate(-100%, -50%);
	} */
	.handle:active:after {
		background-color: #ddd;
		z-index: 9;
	}
</style>
