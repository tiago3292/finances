import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getItems, createItem, updateItem, deleteItem } from "../api/items";
import { uploadFile, deleteFile } from "../api/uploads";
import Navbar from "../components/Navbar";

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

  const [uploadingId, setUploadingId] = useState(null);

  // Filtros
  const [filterCategory, setFilterCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const navigate = useNavigate();

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

  async function handleFileUpload(itemId, file) {
    setUploadingId(itemId);
    try {
      await uploadFile(itemId, file);
      await loadItems();
    } catch (err) {
      setError("Não foi possível enviar o arquivo.");
    } finally {
      setUploadingId(null);
    }
  }

  async function handleFileDelete(filename) {
    try {
      await deleteFile(filename);
      await loadItems();
    } catch (err) {
      setError("Não foi possível remover o arquivo.");
    }
  }

  const categoryOptions = type === "gasto" ? EXPENSE_CATEGORIES : EARNING_CATEGORIES;

  // Lista única de categorias para o filtro
  const allCategories = useMemo(() => {
    return Array.from(new Set(items.map((i) => i.category)));
  }, [items]);

  // Lógica de filtragem por Categoria e Data
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (filterCategory && item.category !== filterCategory) return false;

      if (item.created_at) {
        const itemDate = new Date(item.created_at).getTime();
        if (startDate && itemDate < new Date(startDate).getTime()) return false;
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59);
          if (itemDate > end.getTime()) return false;
        }
      }
      return true;
    });
  }, [items, filterCategory, startDate, endDate]);

  const gastos = filteredItems.filter((i) => i.type === "gasto");
  const ganhos = filteredItems.filter((i) => i.type === "ganho");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 font-mono p-8 flex items-center justify-center">
        <div className="border-4 border-zinc-100 p-6 bg-zinc-900 shadow-[8px_8px_0px_0px_rgba(244,244,245,1)] animate-pulse">
          <p className="text-xl font-black uppercase">Carregando itens...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-mono p-6 md:p-10 space-y-8">
      {/* Topo com navegação */}
      <Navbar />
      <header className="border-4 border-zinc-100 p-6 bg-zinc-900 shadow-[8px_8px_0px_0px_rgba(244,244,245,1)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase text-orange-600 tracking-tight">Meus Itens</h1>
          <p className="text-xs text-zinc-400 uppercase mt-1 font-bold">Gestão e Registro de Lançamentos</p>
        </div>
      </header>

      {/* Formulário de Adição */}
      <div className="border-4 border-zinc-100 p-6 bg-zinc-900 shadow-[6px_6px_0px_0px_rgba(244,244,245,1)] space-y-4">
        <h2 className="text-xl font-black uppercase text-orange-600 border-b-2 border-zinc-100 pb-2">Novo Registro</h2>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="bg-zinc-950 border-2 border-zinc-100 p-3 text-zinc-100 font-bold focus:outline-none focus:bg-zinc-800"
          />

          <input
            type="number"
            step="0.01"
            min="0.01"
            placeholder="Valor (R$)"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
            className="bg-zinc-950 border-2 border-zinc-100 p-3 text-zinc-100 font-bold focus:outline-none focus:bg-zinc-800"
          />

          <select
            value={type}
            onChange={(e) => {
              const newType = e.target.value;
              setType(newType);
              setCategory(newType === "gasto" ? EXPENSE_CATEGORIES[0] : EARNING_CATEGORIES[0]);
            }}
            className="bg-zinc-950 border-2 border-zinc-100 p-3 text-zinc-100 font-bold focus:outline-none uppercase"
          >
            <option value="gasto">Gasto (-)</option>
            <option value="ganho">Ganho (+)</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-zinc-950 border-2 border-zinc-100 p-3 text-zinc-100 font-bold focus:outline-none uppercase"
          >
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-zinc-100 text-zinc-950 font-black uppercase p-3 border-2 border-zinc-100 hover:bg-zinc-300 active:translate-x-1 active:translate-y-1 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            + Adicionar
          </button>
        </form>
      </div>

      {error && (
        <div className="border-2 border-rose-500 bg-rose-950/50 p-4 text-rose-400 font-bold text-xs uppercase">
          {error}
        </div>
      )}

      {/* Painel de Filtros */}
      <div className="border-4 border-zinc-100 p-6 bg-zinc-900 shadow-[6px_6px_0px_0px_rgba(244,244,245,1)] space-y-4">
        <h2 className="text-xs font-black uppercase text-zinc-400 tracking-wider">Filtrar Lançamentos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs uppercase mb-1 font-bold text-zinc-300">Categoria</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full bg-zinc-950 border-2 border-zinc-100 p-2 font-bold focus:outline-none uppercase"
            >
              <option value="">Todas</option>
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase mb-1 font-bold text-zinc-300">Data Inicial</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-zinc-950 border-2 border-zinc-100 p-2 font-bold focus:outline-none text-zinc-100"
            />
          </div>

          <div>
            <label className="block text-xs uppercase mb-1 font-bold text-zinc-300">Data Final</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-zinc-950 border-2 border-zinc-100 p-2 font-bold focus:outline-none text-zinc-100"
            />
          </div>
        </div>
      </div>

      {/* Tabela de Ganhos */}
      <TableSection
        title="Ganhos (+)"
        data={ganhos}
        accentColor="text-emerald-400"
        editingId={editingId}
        editTitle={editTitle}
        editValue={editValue}
        setEditTitle={setEditTitle}
        setEditValue={setEditValue}
        startEditing={startEditing}
        cancelEditing={cancelEditing}
        handleUpdate={handleUpdate}
        handleDelete={handleDelete}
        handleFileUpload={handleFileUpload}
        handleFileDelete={handleFileDelete}
        uploadingId={uploadingId}
      />

      {/* Tabela de Gastos */}
      <TableSection
        title="Gastos (-)"
        data={gastos}
        accentColor="text-rose-400"
        editingId={editingId}
        editTitle={editTitle}
        editValue={editValue}
        setEditTitle={setEditTitle}
        setEditValue={setEditValue}
        startEditing={startEditing}
        cancelEditing={cancelEditing}
        handleUpdate={handleUpdate}
        handleDelete={handleDelete}
        handleFileUpload={handleFileUpload}
        handleFileDelete={handleFileDelete}
        uploadingId={uploadingId}
      />
    </div>
  );
}

function TableSection({
  title,
  data,
  accentColor,
  editingId,
  editTitle,
  editValue,
  setEditTitle,
  setEditValue,
  startEditing,
  cancelEditing,
  handleUpdate,
  handleDelete,
  handleFileUpload,
  handleFileDelete,
  uploadingId,
}) {
  return (
    <div className="border-4 border-zinc-100 p-6 bg-zinc-900 shadow-[6px_6px_0px_0px_rgba(244,244,245,1)]">
      <h2 className={`text-xl font-black uppercase mb-4 ${accentColor}`}>{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse border-2 border-zinc-100">
          <thead>
            <tr className="bg-zinc-800 border-b-2 border-zinc-100 text-xs uppercase">
              <th className="p-3 border-r-2 border-zinc-100">Título</th>
              <th className="p-3 border-r-2 border-zinc-100">Categoria</th>
              <th className="p-3 border-r-2 border-zinc-100">Valor</th>
              <th className="p-3 border-r-2 border-zinc-100">Data</th>
              <th className="p-3 border-r-2 border-zinc-100">Comprovante</th>
              <th className="p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-zinc-500 uppercase font-bold text-xs">
                  Nenhum lançamento encontrado.
                </td>
              </tr>
            ) : (
              data.map((item) =>
                editingId === item.id ? (
                  <tr key={item.id} className="bg-zinc-800/80 border-b-2 border-zinc-100">
                    <td className="p-2 border-r-2 border-zinc-100">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="bg-zinc-950 border border-zinc-100 p-1 text-zinc-100 font-bold w-full"
                      />
                    </td>
                    <td className="p-2 border-r-2 border-zinc-100 uppercase text-xs">{item.category}</td>
                    <td className="p-2 border-r-2 border-zinc-100">
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="bg-zinc-950 border border-zinc-100 p-1 text-zinc-100 font-bold w-full"
                      />
                    </td>
                    <td className="p-2 border-r-2 border-zinc-100 text-xs">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString("pt-BR") : "-"}
                    </td>
                    <td className="p-2 border-r-2 border-zinc-100 text-xs">-</td>
                    <td className="p-2 space-x-2">
                      <button
                        onClick={() => handleUpdate(item.id)}
                        className="bg-emerald-600 text-zinc-100 font-bold uppercase text-xs px-2 py-1 border border-zinc-100 hover:bg-emerald-500"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="bg-zinc-700 text-zinc-100 font-bold uppercase text-xs px-2 py-1 border border-zinc-100 hover:bg-zinc-600"
                      >
                        Cancelar
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={item.id} className="border-b-2 border-zinc-100 hover:bg-zinc-800/50">
                    <td className="p-3 border-r-2 border-zinc-100 font-bold">{item.title}</td>
                    <td className="p-3 border-r-2 border-zinc-100 uppercase text-xs">{item.category}</td>
                    <td className={`p-3 border-r-2 border-zinc-100 font-black ${accentColor}`}>
                      R$ {Number(item.value).toFixed(2)}
                    </td>
                    <td className="p-3 border-r-2 border-zinc-100 text-xs">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString("pt-BR") : "-"}
                    </td>
                    <td className="p-3 border-r-2 border-zinc-100 text-xs">
                      {item.uploaded_file ? (
                        <div className="flex items-center space-x-2">
                          <span className="underline font-bold text-zinc-300">
                            {item.uploaded_file.slice(0, 10)}...jpg
                          </span>
                          <button
                            onClick={() => handleFileDelete(item.uploaded_file)}
                            className="text-rose-400 hover:text-rose-200 font-bold"
                            title="Remover arquivo"
                          >
                            [x]
                          </button>
                        </div>
                      ) : (
                        <input
                          type="file"
                          disabled={uploadingId === item.id}
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) handleFileUpload(item.id, file);
                          }}
                          className="text-xs text-zinc-400 file:mr-2 file:bg-zinc-100 file:text-zinc-950 file:border-0 file:font-bold file:uppercase file:px-2 file:py-1"
                        />
                      )}
                    </td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => startEditing(item)}
                        className="bg-zinc-800 text-zinc-100 font-bold uppercase text-xs px-2 py-1 border border-zinc-100 hover:bg-zinc-700"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-rose-600 text-zinc-100 font-bold uppercase text-xs px-2 py-1 border border-zinc-100 hover:bg-rose-500"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ItemsPage;