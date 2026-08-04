import { useState, useEffect } from "react";
import { getItems, createItem, updateItem, deleteItem } from "../api/items";

const EXPENSE_CATEGORIES = ["contas", "mercado", "transporte", "manutenções", "lazer", "outro gasto"];
const EARNING_CATEGORIES = ["salário", "vale", "outro ganho"];

function ItemsPage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [type, setType] = useState("gasto");
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    try {
      const data = await getItems();
      setItems(data);
    } catch (err) {
      setError("Não foi possível carregar os itens.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    try {
      await createItem({ title, value: parseFloat(value), type, category });
      setTitle("");
      setValue("");
      await loadItems();
    } catch (err) {
      setError("Não foi possível criar o item.");
    }
  }

  function startEditing(item) {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditValue(String(item.value));
  }

  function cancelEditing() {
    setEditingId(null);
  }

  async function handleUpdate(itemId) {
    try {
      await updateItem(itemId, {
        title: editTitle,
        value: parseFloat(editValue),
      });
      setEditingId(null);
      await loadItems();
    } catch (err) {
      setError("Não foi possível atualizar o item.");
    }
  }

  async function handleDelete(itemId) {
    if (!window.confirm("Tem certeza que deseja excluir este item?")) return;
    try {
      await deleteItem(itemId);
      await loadItems();
    } catch (err) {
      setError("Não foi possível excluir o item.");
    }
  }

  const categoryOptions = type === "gasto" ? EXPENSE_CATEGORIES : EARNING_CATEGORIES;

  if (isLoading) return <p>Carregando itens...</p>;

  return (
    <div>
      <h1>Meus itens</h1>

      <form onSubmit={handleCreate}>
        <input type="text" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input type="number" step="0.01" min="0.01" placeholder="Valor" value={value} onChange={(e) => setValue(e.target.value)} required />
        <select
          value={type}
          onChange={(e) => {
            const newType = e.target.value;
            setType(newType);
            setCategory(newType === "gasto" ? EXPENSE_CATEGORIES[0] : EARNING_CATEGORIES[0]);
          }}
        >
          <option value="gasto">Gasto</option>
          <option value="ganho">Ganho</option>
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button type="submit">Adicionar</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {items.map((item) =>
          editingId === item.id ? (
            <li key={item.id}>
              <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
              <input type="number" step="0.01" min="0.01" value={editValue} onChange={(e) => setEditValue(e.target.value)} />
              <button onClick={() => handleUpdate(item.id)}>Salvar</button>
              <button onClick={cancelEditing}>Cancelar</button>
            </li>
          ) : (
            <li key={item.id}>
              {item.title} — {item.type} — R$ {item.value} ({item.category})
              <button onClick={() => startEditing(item)}>Editar</button>
              <button onClick={() => handleDelete(item.id)}>Excluir</button>
            </li>
          )
        )}
      </ul>
    </div>
  );
}

export default ItemsPage;