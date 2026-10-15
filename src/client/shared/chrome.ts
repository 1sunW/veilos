
import { isemulatedsw, iswindow } from "@client/entry";
import { ScramjetClient } from "@client/index";

export default function (client: ScramjetClient, self: any) {
	const del = (name: string) => {
		const split = name.split(".");
		const prop = split.pop();
		const target = split.reduce((a, b) => a?.[b], self);
		if (!target) return;
		if (prop && prop in target) {
			delete target[prop];
		} else {
		}
	};

	del("BarcodeDetector");
	del("FaceDetector");
	del("TextDetector");

	if (iswindow) {
		del("ServiceWorkerRegistration.prototype.sync");
	}
	if (isemulatedsw) {
		del("SyncManager");
		del("SyncEvent");
	}

	del("TrustedHTML");
	del("TrustedScript");
	del("TrustedScriptURL");
	del("TrustedTypePolicy");
	del("TrustedTypePolicyFactory");
	self.__defineGetter__("trustedTypes", () => undefined);

	del("Navigator.prototype.joinAdInterestGroup");

	if (!iswindow) return;

	del("MediaDevices.prototype.setCaptureHandleConfig");

	del("Navigator.prototype.bluetooth");
	del("Bluetooth");
	del("BluetoothDevice");
	del("BluetoothRemoteGATTServer");
	del("BluetoothRemoteGATTCharacteristic");
	del("BluetoothRemoteGATTDescriptor");
	del("BluetoothUUID");

	del("Navigator.prototype.contacts");
	del("ContactAddress");
	del("ContactManager");

	del("IdleDetector");

	del("Navigator.prototype.presentation");
	del("Presentation");
	del("PresentationConnection");
	del("PresentationReceiver");
	del("PresentationRequest");
	del("PresentationAvailability");
	del("PresentationConnectionAvailableEvent");
	del("PresentationConnectionCloseEvent");
	del("PresentationConnectionList");

	del("WindowControlsOverlay");
	del("WindowControlsOverlayGeometryChangeEvent");
	del("Navigator.prototype.windowControlsOverlay");

	del("Navigator.prototype.hid");
	del("HID");
	del("HIDDevice");
	del("HIDConnectionEvent");
	del("HIDInputReportEvent");

	del("navigation");
	del("NavigateEvent");
	del("NavigationActivation");
	del("NavigationCurrentEntryChangeEvent");
	del("NavigationDestination");
	del("NavigationHistoryEntry");
	del("NavigationTransition");
}
