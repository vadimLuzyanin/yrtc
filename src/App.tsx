import { Awareness } from "y-protocols/awareness";
import { Doc } from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { useEffect, useMemo, useState } from "react";
import syncedStore from "@syncedstore/core";
import { useSyncedStore } from "@syncedstore/react";

const doc = new Doc();
const awareness = new Awareness(doc);

const provider = new WebrtcProvider("test-sandbox", doc, {
  awareness,
  filterBcConns: true,
  peerOpts: {},
});
provider.awareness.setLocalStateField("name", Math.random());

export default function App() {
  const store = useMemo(
    () => syncedStore({ data: {} as { text: string } }, doc),
    []
  );
  const [a, setA] = useState<unknown[]>([]);
  const state = useSyncedStore(store);
  useEffect(() => {
    provider.awareness.on("change", () => {
      setA([...provider.awareness.getStates().values()]);
    });
  }, []);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100vw",
      }}
    >
      <input
        value={state.data.text}
        onChange={(e) => (state.data.text = e.target.value)}
      />
      <div>self</div>
      <pre>{JSON.stringify(provider.awareness.getLocalState(), null, 2)}</pre>
      <div>all</div>
      <pre>{JSON.stringify(a, null, 2)}</pre>
    </div>
  );
}
