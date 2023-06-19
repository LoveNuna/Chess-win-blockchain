// rxjs
import { BehaviorSubject } from 'rxjs';

import { environment } from '../../../environments/environment';

let url: string;
let instance: WebSocket;

export const webSocketEvent: BehaviorSubject<any> = new BehaviorSubject<any>(null);

export function openConnection(userId: string) {
	url = environment.socket.webSocketUrl + userId;
	instance = new WebSocket(url);

	instance.onopen = onOpenListener;
	instance.onclose = onCloseListener;
	instance.onmessage = ev => onMessageListener(ev);
}

export function close() {
	instance?.close(1000);
}

function onOpenListener(ev: any) {}

function onCloseListener(ev: CloseEvent) {
	switch (ev.code) {
	case 1000:
		break;

	default:
		reconnect();
		break;
	}
}

function onMessageListener(ev: any) {
	const event = JSON.parse(ev.data);

	if (!event.type) {
		return;
	}

	webSocketEvent.next(event);
}

function reconnect() {
	instance.removeEventListener('open', onOpenListener);
	instance.removeEventListener('close', onCloseListener);

	setTimeout(() => {
		openConnection(url);
	}, 5000);
}
