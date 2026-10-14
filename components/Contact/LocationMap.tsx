"use client";

import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerPopup,
} from "@/components/ui/map";

// Keep the location used by the previous Abhigna Capitol map embed.
const LOCATION: [number, number] = [77.64027657507543, 12.915233887394944];

export default function LocationMap() {
  return (
    <div className="h-full w-full" role="region" aria-label="Abhigna Capitol location map">
      <Map
        center={LOCATION}
        zoom={15}
        theme="light"
        scrollZoom={false}
        dragRotate={false}
        pitchWithRotate={false}
      >
        <MapMarker longitude={LOCATION[0]} latitude={LOCATION[1]}>
          <MarkerContent>
            <div className="flex size-11 items-center justify-center rounded-full border-[3px] border-white bg-[#22372b] shadow-[0_8px_24px_rgba(0,0,0,.25)]">
              <span className="size-3 rounded-full bg-white" />
            </div>
          </MarkerContent>
          <MarkerPopup closeOnClick={false} className="border-0 bg-white p-4 text-[#1b1d1c] shadow-lg">
            <strong className="block text-sm">Abhigna Constructions</strong>
            <span className="mt-1 block text-xs text-zinc-600">HSR Layout · Bengaluru</span>
          </MarkerPopup>
        </MapMarker>
        <MapControls className="[&>div]:border-zinc-200 [&>div]:bg-white [&_button]:text-zinc-800 [&_button:hover]:bg-zinc-100" />
      </Map>
    </div>
  );
}
