import { useState, useEffect } from "react";
const BASE_URL = "https://lostandfound-1-7zzd.onrender.com";

const LOST_API_URL = `${BASE_URL}/api/items`;
const FOUND_API_URL = `${BASE_URL}/api/found-items`;

// ---------- Reusable styles ----------
const styles = {
  page: { fontFamily: "Arial, sans-serif", maxWidth: 900, margin: "0 auto", padding: "20px" },
  nav: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    borderBottom: "1px solid #ddd",
    paddingBottom: "15px",
  },
  navButton: (active) => ({
    padding: "8px 16px",
    border: "1px solid #333",
    borderRadius: "4px",
    background: active ? "#333" : "#fff",
    color: active ? "#fff" : "#333",
    cursor: "pointer",
  }),
  form: { display: "flex", flexDirection: "column", gap: "12px", maxWidth: 500 },
  field: { display: "flex", flexDirection: "column", gap: "4px" },
  input: { padding: "8px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px" },
  submitBtn: {
    padding: "10px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "15px",
  },
  cancelBtn: {
    padding: "10px",
    background: "#999",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "15px",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "6px",
    padding: "12px 16px",
    marginBottom: "10px",
    background: "#fafafa",
  },
  cardActions: { display: "flex", gap: "8px", marginTop: "8px" },
  smallBtn: (color) => ({
    padding: "5px 10px",
    background: color,
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
  }),
  searchRow: { display: "flex", gap: "8px", marginBottom: "16px" },
  errorText: { color: "#c0392b", fontSize: "13px" },
};

// ---------- Error helper ----------
// The backend's GlobalExceptionHandler returns { fieldName: "message" } for
// validation errors (400), and ResponseStatusException for 404s (with a
// plain "message" field in the JSON body). This helper normalizes both.
async function parseError(response) {
  try {
    const data = await response.json();
    if (data && typeof data === "object") {
      if (data.message) return data.message;
      const messages = Object.entries(data).map(([field, msg]) => `${field}: ${msg}`);
      if (messages.length) return messages.join(", ");
    }
    return `Request failed with status ${response.status}`;
  } catch {
    return `Request failed with status ${response.status}`;
  }
}

function App() {
  const [page, setPage] = useState("home");

  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);

  const [lostSearch, setLostSearch] = useState("");
  const [foundSearch, setFoundSearch] = useState("");

  const [editingLostItem, setEditingLostItem] = useState(null); // null = add mode, object = edit mode
  const [editingFoundItem, setEditingFoundItem] = useState(null);

  const [lostError, setLostError] = useState("");
  const [foundError, setFoundError] = useState("");

  // ---------- Fetch ----------
  const fetchItems = async () => {
    try {
      const response = await fetch(LOST_API_URL);
      if (response.ok) {
        setLostItems(await response.json());
      } else {
        console.error("Failed to fetch lost items");
      }
    } catch (error) {
      console.error("Error fetching lost items:", error);
    }
  };

  const fetchFoundItems = async () => {
    try {
      const response = await fetch(FOUND_API_URL);
      if (response.ok) {
        setFoundItems(await response.json());
      } else {
        console.error("Failed to fetch found items");
      }
    } catch (error) {
      console.error("Error fetching found items:", error);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchFoundItems();
  }, []);

  // ---------- Lost item: create / update ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLostError("");

    const formData = new FormData(e.target);
    const item = {
      itemname: formData.get("itemName"),
      description: formData.get("description"),
      location: formData.get("location"),
      contact: formData.get("contact"),
    };

    const isEditing = Boolean(editingLostItem);
    const url = isEditing ? `${LOST_API_URL}/${editingLostItem.id}` : LOST_API_URL;
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });

      if (response.ok) {
        alert(isEditing ? "Lost item updated" : "Lost item reported");
        setEditingLostItem(null);
        e.target.reset();
        fetchItems();
        setPage("home");
      } else {
        setLostError(await parseError(response));
      }
    } catch (error) {
      console.error("Error submitting lost item:", error);
      setLostError("Could not connect to the backend.");
    }
  };

  const handleDeleteLostItem = async (id) => {
    if (!window.confirm("Delete this lost item?")) return;
    try {
      const response = await fetch(`${LOST_API_URL}/${id}`, { method: "DELETE" });
      if (response.ok || response.status === 204) {
        fetchItems();
      } else {
        alert("Failed to delete lost item.");
      }
    } catch (error) {
      console.error("Error deleting lost item:", error);
      alert("Could not connect to the backend.");
    }
  };

  const startEditLostItem = (item) => {
    setEditingLostItem(item);
    setPage("lost");
  };

  // ---------- Found item: create / update ----------
  const handleFoundSubmit = async (e) => {
    e.preventDefault();
    setFoundError("");

    const formData = new FormData(e.target);
    const item = {
      itemname: formData.get("itemName"),
      description: formData.get("description"),
      location: formData.get("location"),
      date: formData.get("date"),
    };

    const isEditing = Boolean(editingFoundItem);
    const url = isEditing ? `${FOUND_API_URL}/${editingFoundItem.id}` : FOUND_API_URL;
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });

      if (response.ok) {
        alert(isEditing ? "Found item updated" : "Found item reported");
        setEditingFoundItem(null);
        e.target.reset();
        fetchFoundItems();
        setPage("home");
      } else {
        setFoundError(await parseError(response));
      }
    } catch (error) {
      console.error("Error submitting found item:", error);
      setFoundError("Could not connect to the backend.");
    }
  };

  const handleDeleteFoundItem = async (id) => {
    if (!window.confirm("Delete this found item?")) return;
    try {
      const response = await fetch(`${FOUND_API_URL}/${id}`, { method: "DELETE" });
      if (response.ok || response.status === 204) {
        fetchFoundItems();
      } else {
        alert("Failed to delete found item.");
      }
    } catch (error) {
      console.error("Error deleting found item:", error);
      alert("Could not connect to the backend.");
    }
  };

  const startEditFoundItem = (item) => {
    setEditingFoundItem(item);
    setPage("found");
  };

  // ---------- Search ----------
  const handleLostSearch = async (e) => {
    e.preventDefault();
    if (!lostSearch.trim()) {
      fetchItems();
      return;
    }
    try {
      const response = await fetch(`${LOST_API_URL}/search?itemname=${encodeURIComponent(lostSearch)}`);
      if (response.ok) {
        setLostItems(await response.json());
      }
    } catch (error) {
      console.error("Error searching lost items:", error);
    }
  };

  const handleFoundSearch = async (e) => {
    e.preventDefault();
    if (!foundSearch.trim()) {
      fetchFoundItems();
      return;
    }
    try {
      const response = await fetch(`${FOUND_API_URL}/search?itemname=${encodeURIComponent(foundSearch)}`);
      if (response.ok) {
        setFoundItems(await response.json());
      }
    } catch (error) {
      console.error("Error searching found items:", error);
    }
  };

  // ---------- Nav ----------
  const goHome = () => {
    setEditingLostItem(null);
    setEditingFoundItem(null);
    setLostError("");
    setFoundError("");
    setPage("home");
  };

  const goLost = () => {
    setEditingLostItem(null);
    setLostError("");
    setPage("lost");
  };

  const goFound = () => {
    setEditingFoundItem(null);
    setFoundError("");
    setPage("found");
  };

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <button style={styles.navButton(page === "home")} onClick={goHome}>
          Home
        </button>
        <button style={styles.navButton(page === "lost")} onClick={goLost}>
          Report Lost Item
        </button>
        <button style={styles.navButton(page === "found")} onClick={goFound}>
          Report Found Item
        </button>
      </nav>

      {/* ---------------- HOME PAGE ---------------- */}
      {page === "home" && (
        <main>
          <h1>Lost & Found Portal</h1>
          <p>Find what you lost or help someone find their item.</p>

          {/* Lost Items */}
          <section>
            <h2>Lost Items</h2>
            <form style={styles.searchRow} onSubmit={handleLostSearch}>
              <input
                style={{ ...styles.input, flex: 1 }}
                type="text"
                placeholder="Search lost items by name..."
                value={lostSearch}
                onChange={(e) => setLostSearch(e.target.value)}
              />
              <button type="submit" style={styles.submitBtn}>
                Search
              </button>
              <button
                type="button"
                style={styles.cancelBtn}
                onClick={() => {
                  setLostSearch("");
                  fetchItems();
                }}
              >
                Reset
              </button>
            </form>

            {lostItems.length === 0 && <p>No lost items reported yet.</p>}

            {lostItems.map((item) => (
              <div key={item.id} style={styles.card}>
                <h3>{item.itemname}</h3>
                <p>Description: {item.description}</p>
                <p>Last seen: {item.location}</p>
                <p>Contact: {item.contact}</p>
                <div style={styles.cardActions}>
                  <button style={styles.smallBtn("#2563eb")} onClick={() => startEditLostItem(item)}>
                    Edit
                  </button>
                  <button style={styles.smallBtn("#c0392b")} onClick={() => handleDeleteLostItem(item.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </section>

          {/* Found Items */}
          <section>
            <h2>Found Items</h2>
            <form style={styles.searchRow} onSubmit={handleFoundSearch}>
              <input
                style={{ ...styles.input, flex: 1 }}
                type="text"
                placeholder="Search found items by name..."
                value={foundSearch}
                onChange={(e) => setFoundSearch(e.target.value)}
              />
              <button type="submit" style={styles.submitBtn}>
                Search
              </button>
              <button
                type="button"
                style={styles.cancelBtn}
                onClick={() => {
                  setFoundSearch("");
                  fetchFoundItems();
                }}
              >
                Reset
              </button>
            </form>

            {foundItems.length === 0 && <p>No found items reported yet.</p>}

            {foundItems.map((item) => (
              <div key={item.id} style={styles.card}>
                <h3>{item.itemname}</h3>
                <p>Description: {item.description}</p>
                <p>Found location: {item.location}</p>
                <p>Date found: {item.date}</p>
                <div style={styles.cardActions}>
                  <button style={styles.smallBtn("#2563eb")} onClick={() => startEditFoundItem(item)}>
                    Edit
                  </button>
                  <button style={styles.smallBtn("#c0392b")} onClick={() => handleDeleteFoundItem(item.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </section>
        </main>
      )}

      {/* ---------------- LOST ITEM PAGE ---------------- */}
      {page === "lost" && (
        <main>
          <h1>{editingLostItem ? "Edit Lost Item" : "Report Lost Item"}</h1>
          <p>Enter the details of your lost item.</p>

          {lostError && <p style={styles.errorText}>{lostError}</p>}

          <form style={styles.form} onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label htmlFor="itemName">Item name</label>
              <input
                style={styles.input}
                id="itemName"
                name="itemName"
                type="text"
                defaultValue={editingLostItem?.itemname || ""}
                required
              />
            </div>

            <div style={styles.field}>
              <label htmlFor="description">Description</label>
              <textarea
                style={styles.input}
                id="description"
                name="description"
                defaultValue={editingLostItem?.description || ""}
                required
              ></textarea>
            </div>

            <div style={styles.field}>
              <label htmlFor="location">Last seen location</label>
              <input
                style={styles.input}
                id="location"
                name="location"
                type="text"
                defaultValue={editingLostItem?.location || ""}
                required
              />
            </div>

            <div style={styles.field}>
              <label htmlFor="contact">Contact Email</label>
              <input
                style={styles.input}
                id="contact"
                name="contact"
                type="email"
                defaultValue={editingLostItem?.contact || ""}
                required
              />
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" style={styles.submitBtn}>
                {editingLostItem ? "Update lost item" : "Report lost item"}
              </button>
              {editingLostItem && (
                <button type="button" style={styles.cancelBtn} onClick={goLost}>
                  Cancel edit
                </button>
              )}
            </div>
          </form>
        </main>
      )}

      {/* ---------------- FOUND ITEM PAGE ---------------- */}
      {page === "found" && (
        <main>
          <h1>{editingFoundItem ? "Edit Found Item" : "Report Found Item"}</h1>
          <p>Enter the details of the item you found.</p>

          {foundError && <p style={styles.errorText}>{foundError}</p>}

          <form style={styles.form} onSubmit={handleFoundSubmit}>
            <div style={styles.field}>
              <label htmlFor="foundItemName">Item name</label>
              <input
                style={styles.input}
                id="foundItemName"
                name="itemName"
                type="text"
                defaultValue={editingFoundItem?.itemname || ""}
                required
              />
            </div>

            <div style={styles.field}>
              <label htmlFor="foundDescription">Description</label>
              <textarea
                style={styles.input}
                name="description"
                id="foundDescription"
                defaultValue={editingFoundItem?.description || ""}
                required
              ></textarea>
            </div>

            <div style={styles.field}>
              <label htmlFor="foundLocation">Found Location</label>
              <input
                style={styles.input}
                id="foundLocation"
                name="location"
                type="text"
                defaultValue={editingFoundItem?.location || ""}
                required
              />
            </div>

            <div style={styles.field}>
              <label htmlFor="foundDate">Date found</label>
              <input
                style={styles.input}
                id="foundDate"
                name="date"
                type="date"
                defaultValue={editingFoundItem?.date || ""}
                required
              />
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" style={styles.submitBtn}>
                {editingFoundItem ? "Update found item" : "Report Found Item"}
              </button>
              {editingFoundItem && (
                <button type="button" style={styles.cancelBtn} onClick={goFound}>
                  Cancel edit
                </button>
              )}
            </div>
          </form>
        </main>
      )}
    </div>
  );
}

export default App;
