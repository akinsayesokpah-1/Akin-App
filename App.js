import React, { useEffect, useState } from "react";

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    fetch("/api/items")
      .then((res) => res.json())
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  const addItem = async () => {
    if (!newItem) return;
    const res = await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newItem }),
    });
    const data = await res.json();
    setItems([data, ...items]);
    setNewItem("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>My Fullstack App</h1>
      <input
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        placeholder="Add item"
      />
      <button onClick={addItem}>Add</button>
      <ul>
        {items.map((i) => (
          <li key={i.id}>{i.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;